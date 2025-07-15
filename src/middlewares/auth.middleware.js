import jwt from "jsonwebtoken";
import {
  AuthFailureError,
  BadRequestError,
} from "../handlers/error.response.js";
import AuthUtil from "../utils/auth.utils.js";

export default class AuthValidator {
  constructor() {
    this.authUtil = new AuthUtil();
  }

  registerValidate = async (req, res, next) => {
    try {
      const user = req.body;
      if (!user.email || !user.password) {
        throw new BadRequestError("Nhập thiếu thông tin!");
      }
      // validate email (regex and duplicate email)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const checkEmail = emailRegex.test(user.email);
      if (!checkEmail) {
        throw new BadRequestError("Email is invalid");
      }
      // validate password (minlength = 5)
      if (user.password.trim().length < 5) {
        throw new BadRequestError("Password must be at least 5 characters");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
  loginValidate = async (req, res, next) => {
    try {
      const user = req.body;
      if (!user.email) {
        throw new BadRequestError("Please enter email");
      }
      if (!user.password) {
        throw new BadRequestError("Please enter password");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
  checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Yêu cầu xác thực. Vui lòng đăng nhập.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Không có token, yêu cầu đăng nhập" });
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    try {
      const decoded = jwt.verify(token, accessTokenSecret);

      if (!decoded || !decoded.id) {
        return res
          .status(401)
          .json({ message: "Token không chứa thông tin người dùng" });
      }
      req.role = decoded.role;
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  };
  checkAdmin = async (req, res, next) => {
    this.checkAuth(req, res, async (err) => {
      if (err) return next(err);
      try {
        if (req.role == "admin") {
          next();
        } else {
          throw new AuthFailureError("You're not allowed to do that!");
        }
      } catch (error) {
        next(error);
      }
    });
  };

  checkUpdateProfile = async (req, res, next) => {
    this.checkAuth(req, res, async (err) => {
      if (err) return next(err);
      try {
        const id = req.params.id;
        if (req.role == "admin") {
          next();
        } else {
          if (id == req.userId) {
            next();
          } else {
            throw new AuthFailureError("You're not allowed to do that!");
          }
        }
      } catch (error) {
        next(error);
      }
    });
  };
}
