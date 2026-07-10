/* inside this asyncHandler function, we return a new function,
 which calls the original request handler function. wrapped in a try-catch block*/

const asyncHandler= (requestHandler)=>{
/*   It returns a new function — this returned function is 
  what Express actually calls when a request hits that
   route. It has the exact (req, res, next) signature Express expects.
 */
return (req,res,next) => {
  Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))
}
}

export {asyncHandler}