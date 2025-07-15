import {
  ConflictRequestError,
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} from "../handlers/error.response.js";
import transporter from "../config/mailer.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthService {
  constructor(User, AuthUtil) {
    this.userModel = User;
    this.AuthUtil = AuthUtil;
  }
  register = async (userData) => {
    const { email, password } = userData;

    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) throw new ConflictRequestError("Email was existed");

    const hashedPassword = await this.AuthUtil.hashPassword(password);

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      email,
    };
  };

  login = async (email, password) => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundError("Not found user!");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const payload = { id: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "6d",
    });

    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  };

  refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) throw new Error("Không có refreshToken");

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
        if (err)
          return reject(new AuthFailureError("Refresh token không hợp lệ"));

        const user = await this.userModel.findById(decoded.id);
        if (!user) return reject(new NotFoundError("Người dùng không tồn tại"));

        const payload = { id: user.id, email: user.email };
        const newAccessToken = jwt.sign(payload, accessTokenSecret, {
          expiresIn: "15m",
        });
        const newRefreshToken = jwt.sign(payload, refreshTokenSecret, {
          expiresIn: "7d",
        });

        resolve({ newAccessToken, newRefreshToken });
      });
    });
  };

  sendOtpToEmail = async (email) => {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundError("Email không tồn tại");

    const otp = this.AuthUtil.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã có hiệu lực trong 5 phút.</p>`,
    });

    return { message: "Đã gửi OTP tới email." };
  };

  verifyOtpAndResetPassword = async (email, otp, newPassword) => {
    const user = await this.userModel.findOne({ email });
    if (!user || user.otp !== otp || !user.otpExpiresAt) {
      throw new Error(user.otpExpiresAt);
    }
    if (user.otpExpiresAt < new Date()) {
      throw new Error("OTP đã hết hạn");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { message: "Mật khẩu đã được đặt lại thành công" };
  };
}
