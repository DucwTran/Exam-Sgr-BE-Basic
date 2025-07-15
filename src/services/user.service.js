import {
  ConflictRequestError,
  NotFoundError,
} from "../handlers/error.response.js";


export class UserService {
  constructor(User, AuthUtil) {
    this.userModel = User;
    this.AuthUtil = AuthUtil;
  }
  getAllUsers = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const total = await this.userModel.countDocuments();

    if (skip < 0 || limit <= 0) {
      throw new ConflictRequestError("Invalid pagination parameters");
    }
    if (skip >= total) {
      throw new NotFoundError("No users found for the given page");
    }
    const users = await this.userModel.find().skip(skip).limit(limit);

    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
    };
    return {
      users,
      pagination,
    };
  };

  getUserById = async (userId) => {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return user;
  };

  createUser = async (userInit) => {
    const { fullName, address, email, gender, phone, age, password } = userInit;

    if (
      !fullName ||
      !address ||
      !email ||
      !gender ||
      !phone ||
      !age ||
      !password
    ) {
      throw new BadRequestError("Input more infomation of user");
    }

    const emailExisting = await this.userModel.find({ email: email });
    if (emailExisting) {
      throw new ConflictRequestError("Email was existed");
    }
    const hashPassword = this.AuthUtil.hashPassword(password);
    const newUser = new this.userModel({
      email: email,
      fullName: fullName,
      address: address,
      password: hashPassword,
      gender: gender,
      phone: phone,
      age: parseInt(age),
      role: "user",
    });
    await newUser.save();
    return newUser;
  };

  updateUser = async (id, userData) => {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundError("User Not Found");
    } else {
      const emailExisting = await this.userModel.findOne({
        email: userData.email,
        _id: { $ne: id },
      });
      if (emailExisting) {
        throw new ConflictRequestError("This email already exists!");
      }
      if (userData.password) {
        const hashPassword = AuthUtil.hashPassword(userData.password);
        user.password = hashPassword;
      }
      if (userData.role) {
        const validRoles = ["user", "admin"];
        if (!validRoles.includes(userData.role)) {
          throw new ConflictRequestError(
            "Invalid role. Only 'user' or 'admin' allowed."
          );
        }
        user.role = userData.role;
      }

      await user.save();
      return user;
    }
  };

  deleteUser = async (userId) => {
    const user = await this.userModel.findById(userId);
    console.log(user);
    console.log(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    await this.userModel.deleteOne({ _id: userId });
    return user;
  };

  getUserInfo = async (id) => {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return user;
  };
}

export default UserService;
