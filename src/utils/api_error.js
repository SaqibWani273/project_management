class ApiError extends Error {
  constructor(code, message = "An UnExpected Error Occured", data,errors,stack="") {
    super(message);
    this.code = code;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.data =data|| null;
    if(stack){
      this.stack = stack
    }else{
      // this.stack = Error.captureStackTrace(this, this.constructor);
        Error.captureStackTrace(this, this.constructor); // no assignment — it self-mutates

    }
  }
}

export default ApiError