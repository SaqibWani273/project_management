import ApiError from "../utils/api_error.js";
import { asyncHandler } from "../utils/handlers.js";
import jwt from "jsonwebtoken";
import User from "../db/user.models.js";

const jwtAuthMiddleware = asyncHandler(async (req, res, next) => {
    const rawJwt = req.cookie?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!rawJwt) {
        throw new ApiError(401, "JWT Access token NOT FOUND");
    }
    const decodedJwt = jwt.verify(rawJwt, process.env.JWT_ACCESS_TOKEN_SECRET);
    const userId = decodedJwt.id;
    const userInDb = await User.findById(userId).
        select("-password -emailVerificationToken -emailVerificationTokenExpiry -refreshToken");
    if (!userInDb) {
        throw new ApiError(401, "Invalid JWT Access token");
    }
    req.user = userInDb;
    next();
})
export default jwtAuthMiddleware