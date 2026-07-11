import {Router} from "express";

import {regsiterUser} from "../controllers/auth.controllers.js";
const authRouter = Router();
authRouter.post("/register", regsiterUser);
export default authRouter;