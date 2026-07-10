import {Router} from "express";
import {healthcheck} from "../controllers/healthcheck.controllers.js";

const healthCehckRouter = Router();
healthCehckRouter.get("/", healthcheck);
export default healthCehckRouter;