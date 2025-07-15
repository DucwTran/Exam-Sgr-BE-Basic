import { OK } from "../handlers/success.response.js";

export default class AuthController {
  constructor(AuthService) {
    this.authService = AuthService;
  }
  register = async (req, res) => {
    const result = await this.authService.register(req.body);
    new OK({
      message: "successfully!",
      metadata: {
        user: result,
      },
    }).send(res);
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.login(
      email,
      password
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    new OK({
      message: "Login successfully",
      metadata: { accessToken },
    }).send(res);
  };

  processNewToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    new OK({
      metadata: { accessToken: newAccessToken },
      message: "Cấp accessToken mới thành công",
    }).send(res);
  };

  logout = async (req, res) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 0,
    });
    new OK({
      message: "Logout thành công",
    }).send(res);
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;
    const result = await this.authService.sendOtpToEmail(email);
    new OK({
      result,
    }).send(res);
  };

  verifyOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await this.authService.verifyOtpAndResetPassword(
      email,
      otp,
      newPassword
    );
    new OK({
      result,
    }).send(res);
  };
}
