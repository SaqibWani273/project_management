class ApiError extends Error {
  constructor(
    code,
    message = "An unexpected error occurred",
    data = null,
    errors = [],
    stack
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.success = false;
    this.data = data;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError