import { StatusCodes, ReasonPhrases } from "http-status-codes";

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

export {
  ErrorResponse, //Tùy truyền vào - Class cha cho các lỗi khác, dùng chung cho những lỗi có thể tùy chỉnh message/status.
  ConflictRequestError, //409 - Khi có xung đột tài nguyên, ví dụ: đăng ký tài khoản với email đã tồn tại.
  BadRequestError, //400 - Khi client gửi yêu cầu không hợp lệ, thiếu trường, sai kiểu dữ liệu...
  AuthFailureError, //401 - Khi xác thực thất bại, ví dụ: không có token, token sai hoặc hết hạn.
  NotFoundError, //404 - Khi không tìm thấy dữ liệu, ví dụ: user với id không tồn tại.
};
