class ApiResponse{
  constructor(code, message = "Success", data,isSuccess= code<400){
    this.code = code;
    this.message = message;
    this.data = data;
    this.isSuccess = isSuccess
  }
}

export default ApiResponse
