import {Router} from "express";
import userRegistorValidator from "../validators/index.js"
import validateMiddleWare from "../middlewares/validator.middlewares.js"

import {regsiterUser} from "../controllers/auth.controllers.js";
const authRouter = Router();
authRouter.post("/register",userRegistorValidator(),validateMiddleWare, regsiterUser);
export default authRouter;