import { Router } from "express";
import { userRegistorValidator, userLoginValidator } from "../validators/index.js"
import validateMiddleWare from "../middlewares/validator.middlewares.js"

import { regsiterUser, loginUser } from "../controllers/auth.controllers.js";
const authRouter = Router();
authRouter.post("/register", userRegistorValidator(), validateMiddleWare, regsiterUser);
authRouter.post("/login", userLoginValidator(), validateMiddleWare, loginUser);
export default authRouter;