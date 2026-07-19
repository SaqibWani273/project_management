
import { asyncHandler } from "../utils/handlers.js";
import User from "../db/user.models.js";
import ApiError from "../utils/api_error.js";
import { sendEmail, registerEmailContent } from "../utils/mail.js"
import ApiResponse from "../utils/api_response.js";
import crypto from "node:crypto";

const regsiterUser = asyncHandler(async (req, res) => {
  /* Complete following steps
   1. Validate the data
   2. Check in DB if user already exists
   3. Create Access Token, Refresh Token 
   4. User email verification
   5. Send Response back to user 
    */



  //2. 

  const existingUser = await User.findOne({
    $or: [{ email: req.body.email },
    { username: req.body.username }]
  });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exists")
  }

  //3.

  //3.1 create user in db
  const user = await User.create({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password

  });

  //3.2 generate access token & refresh token
  try {
    const accessToken = user.getJwtToken();
    const refreshToken = user.getJwtRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false
    });

  } catch
  (err) {
    console.log("Error in creating Access Token", err)
    throw new ApiError(500, "Error in creating Access Token")
  }

  //3.3 
  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.forgotPasswordTokenExpiryDate = tokenExpiry;
  user.lastEmailVerificationSentAt = Date.now();
  await user.save({
    validateBeforeSave: false
  });
  //3.4 send email 
  sendEmail({
    email: user.email,
    subject: "Email Verification",

    mailContent: registerEmailContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`)
  })

  const createdUser = await User.findById(user._id).
    select("-password -emailVerificationToken -forgotPasswordTokenExpiryDate -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Error in creating user")
  }
  //3.5 send response
  return res.
    status(201).
    json(new ApiResponse(201, "User Created & Email Verification Sent", createdUser))


})
const loginUser = asyncHandler(async (req, res) => {
  /*  Complete following steps 
   1. Take data from user
   2.Validate
   3.Check user exists
   4.Check password is correct
   5.Generate Tokens (Access token & refresh token)
   6.Send tokens in cookieStore & user-info in JSON-Response */

  const { email, password } = req.body;
  const userInDb = await User.findOne({
    email: email

  });
  if (!userInDb) {
    throw new ApiError(409, "User with this email does not exist")
  }
  const pwMatches = await userInDb.isPasswordMatched(password);
  if (!pwMatches) {
    throw new ApiError(409, "InValid Password")
  }
  if (!userInDb.isEmailVerified) {
    throw new ApiError(409, "Email not Verified yet")
  }
  const accessToken = userInDb.getJwtToken();
  const refreshToken = userInDb.getJwtRefreshToken();

  // get all the user info without password,emailVerificationToken,etc
  const loggedInUser = await User.findById(userInDb._id).
    select("-password -emailVerificationToken -emailVerificationTokenExpiry -refreshToken");
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  }
  return res.status(200).cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions).
    json(new ApiResponse(200, "Login Successfull",
      {
        user: loggedInUser,
        accessToken: accessToken,
        refreshToken: refreshToken
      }))
})
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: null
    }
  });
  const cookieOptions = {
    httpOnly: true,
    secure: true
  };
  return res.status(200).
    clearCookie("accessToken", cookieOptions).
    clearCookie("refreshToken", cookieOptions).
    json(new ApiResponse(200, "User Logged-out Successfully"))

})
const me = asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200,
    "Profile Info Fetched Successfully", {
    "user": req.user
  }))
})
const changePassowrd = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userInDb = await User.findById(req.user._id);
  const pwMatches = await userInDb.isPasswordMatched(currentPassword);
  if (!pwMatches) {
    throw new ApiError(409, "Current password is incorrect")
  }
  if (currentPassword == newPassword) {
    throw new ApiError(409, "Please enter a different new password")
  }
  userInDb.password = newPassword;
  await userInDb.save();

  return res.status(200).json(
    new ApiResponse(200, "Password changed Successdully",)
  )
})
const refreshAccessToken = asyncHandler(async (req, res) => {

})
const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new ApiError(409, " Verification Token is Needed")
  }
  //verificationToken is unhashed
  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
  const userInDb = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiryDate: { $gt: Date.now() }
  });
  if (!userInDb) {
    throw new ApiError(404, "Invalid Verification Token or Token Expired")
  }
  userInDb.isEmailVerified = true;

  //optional but cleans db data
  userInDb.emailVerificationToken = null;
  userInDb.emailVerificationTokenExpiryDate = null;

  //no need to encrypt password or do other validations
  await userInDb.save({ validateBeforeSave: false });
  return res.status(200).
    json(new ApiResponse(200, "Email Verified Successfully. You can now Login"))

})
const forgotPassword = asyncHandler(async (req, res) => {

})
const resetPassword = asyncHandler(async (req, res) => {

})
const resendEmailVerification = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ApiError(409, "UserId is needed");
  }
  const userInDb = await User.findById(userId);
  if (!userInDb) {
    throw new ApiError(404, "UserId not found, enter a proper id");
  }
  if (userInDb.isEmailVerified) {
    throw new ApiError(409, "Email Already Verified");
  }

  // Ensure the interval is treated as a number
  const resendInterval = Number(process.env.EMAIL_RESEND_INTERVAL) || 3;

  // Calculate difference in milliseconds, then convert to minutes
  const timeDiffInMs = Date.now() - userInDb.lastEmailVerificationSentAt.getTime();
  const timeDiffInMinutes = timeDiffInMs / (1000 * 60);

  // Round up to give the user a clear "wait time" (e.g., 1 minute instead of 0.33)
  const remainingWaitTime = Math.ceil(resendInterval - timeDiffInMinutes);

  if (timeDiffInMinutes < resendInterval) {
    throw new ApiError(
      429, // 429 Too Many Requests is more semantically correct than 409
      `Please wait ${remainingWaitTime} minute(s) before requesting another verification email.`
    );
  }
  const { unHashedToken, hashedToken, tokenExpiry } = userInDb.generateTemporaryToken();
  userInDb.emailVerificationToken = hashedToken;
  userInDb.emailVerificationTokenExpiry = tokenExpiry;
  userInDb.lastEmailVerificationSentAt = Date.now();
  await userInDb.save({
    validateBeforeSave: false
  });
  //3.4 send email 
  sendEmail({
    email: userInDb.email,
    subject: "Email Verification",

    mailContent: registerEmailContent(userInDb.username, `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`)
  })
  return res.status(200).
    json(new ApiResponse(200, "Email Verification Sent again"))
})
export { regsiterUser, loginUser, logoutUser, me, changePassowrd, verifyEmail, resendEmailVerification }