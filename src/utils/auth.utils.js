import bcrypt from "bcryptjs";

export default class AuthUtil {
  hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };
  comparePassword = async (inputPassword, hashedPassword) => {
    const check = await bcrypt.compare(inputPassword, hashedPassword);
    return check;
  };

  generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  signAccessToken = (data) => {
    const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "30m",
    });
    return token;
  };
  signRefreshToken = (data) => {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
    });
    return token;
  };
  verifyRefreshToken = (token) => {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return payload;
    } catch (err) {
      throw err;
    }
  };
  verifyAccessToken = (token) => {
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return payload;
    } catch (err) {
      throw err;
    }
  };
}
