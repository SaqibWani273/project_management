class ApiError extends Error {
  constructor(code, message = "An UnExpected Error Occured", data,errors,stack="") {
    super(message);
    this.code = code;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.data = null;
    if(stack){
      this.stack = stack
    }else{
      this.stack = Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError