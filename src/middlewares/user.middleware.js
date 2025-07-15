import { BadRequestError } from "../handlers/error.response.js";

class UserValidator {
  constructor() {}
  checkInput = async (req, res, next) => {
    try {
      const user = req.body;
      if (
        !user.email ||
        !user.password
      ) {
        throw new BadRequestError("Nhập thiếu thông tin!");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = emailRegex.test(user.email);
      if (!checkEmail) {
        throw new BadRequestError("Email is invalid");
      }
      if (user.password.trim().length < 5) {
        throw new BadRequestError("Password must be at least 5 characters");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default UserValidator;
