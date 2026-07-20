import { Router } from "express";
import { userRegistorValidator, userLoginValidator, changePasswordValidator, resendEmailValidator } from "../validators/index.js"
import validateMiddleWare from "../middlewares/validator.middlewares.js"


import {
    regsiterUser, loginUser, logoutUser,
    changePassowrd, me, verifyEmail, resendEmailVerification,
    refreshAccessToken
} from "../controllers/auth.controllers.js";
import jwtAuthMiddleware from "../middlewares/auth.middlewares.js";

const authRouter = Router();
authRouter.post("/register", userRegistorValidator(), validateMiddleWare, regsiterUser);
authRouter.post("/login", userLoginValidator(), validateMiddleWare, loginUser);
authRouter.get("/verify-email/:verificationToken", verifyEmail);
authRouter.post("/resendEmailVerification", resendEmailValidator(), validateMiddleWare, resendEmailVerification);
authRouter.post("/refreshAccessToken", refreshAccessToken);

//secure endpoints
authRouter.post("/logout", jwtAuthMiddleware, logoutUser);
authRouter.get("/me", jwtAuthMiddleware, me);
authRouter.post("/changepassword", changePasswordValidator(), validateMiddleWare, jwtAuthMiddleware, changePassowrd);
export default authRouter;