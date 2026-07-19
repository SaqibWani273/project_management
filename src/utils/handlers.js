/* inside this asyncHandler function, we return a new function,
 which calls the original request handler function. wrapped in a try-catch block*/

const asyncHandler = (requestHandler) => {
  /*   It returns a new function — this returned function is 
    what Express actually calls when a request hits that
     route. It has the exact (req, res, next) signature Express expects.
   */
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      return next(err)
    })
  }
}
const errorHandler = (err, req, res, next) => {
  return res.status(err.code || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: err.data || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
export { asyncHandler, errorHandler }