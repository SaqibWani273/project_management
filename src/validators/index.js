import { body } from "express-validator";


///return empty array if no errors are found
const userRegistorValidator = () => {
  return [
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
    body("username").trim().not().isEmpty().withMessage("Please enter a username"),
    body("password").trim().not().isEmpty().isLength({ min: 6 }).withMessage("Please enter a password with at least 6 characters"),
    body("fullname").trim()
  ]
}
const userLoginValidator = () => {
  return [
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
    body("password").trim().not().isEmpty().isLength({ min: 6 }).withMessage("Please enter a password with at least 6 characters"),
  ]
}
export { userRegistorValidator, userLoginValidator }