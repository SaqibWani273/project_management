import { validationResult } from "express-validator";
import ApiError from "../utils/api_error.js";


///This is a reusable middleware which will catch errors from validator(s)
const validateMiddleWare = (req, res, next) => {
  const errors = validationResult(req);
  console.log("validateMiddleWare errors ", errors);
  if (!errors.isEmpty()) {
    const extractedErrors=[];
    errors.array().map(error => extractedErrors.push({[error.path]:error.msg}))
    throw  new ApiError(422,"Validation Error",null,extractedErrors);
  }
  next();
};
export default validateMiddleWare