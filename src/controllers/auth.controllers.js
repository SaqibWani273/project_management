
import { asyncHandler } from "../utils/handlers.js";
import User from "../db/user.models.js";
import ApiError from "../utils/api_error.js";
import { sendEmail, registerEmailContent } from "../utils/mail.js"
import ApiResponse from "../utils/api_response.js";

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
  user.emailVerificationTokenExpiry = tokenExpiry;
  await user.save({
    validateBeforeSave: false
  });
  //3.4 send email 
  sendEmail({
    email: user.email,
    subject: "Email Verification",

    mailContent: registerEmailContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
  })

  const createdUser = await User.findById(user._id).
    select("-password -emailVerificationToken -emailVerificationTokenExpiry -refreshToken");
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
  const accessToken = userInDb.getJwtToken();
  const refreshToken = userInDb.getJwtRefreshToken();

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
export { regsiterUser, loginUser }