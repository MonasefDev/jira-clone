export class ApiResponse {
  constructor({ data = null, success, statusCode, message }) {
    this.data = data;
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
  }
}
