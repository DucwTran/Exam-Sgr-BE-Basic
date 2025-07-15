import { OK } from "../handlers/success.response.js";

export default class UserController {
  constructor(UserService) {
    this.userService = UserService;
  }
  getAllUsers = async (req, res) => {
    const { page, limit } = req.query;
    const users = await this.userService.getAllUsers({ page, limit });
    new OK({
      message: "Successfully",
      metadata: users,
    }).send(res);
  };

  getUserById = async (req, res) => {
    const user = await this.userService.getUserById(req.params.id);
    new OK({
      message: "Successfully",
      metadata: user,
    }).send(res);
  };

  postUser = async (req, res) => {
    const user = await this.userService.createUser(req.body);
    new OK({
      message: "Successfully",
      metadata: user,
    }).send(res);
  };

  putUser = async (req, res) => {
    const user = await this.userService.updateUser(req.params.id, req.body);
    new OK({
      message: "Update Successfully",
    }).send(res);
  };

  deleteUser = async (req, res) => {
    const user = await this.userService.deleteUser(req.params.id);
    new OK({
      message: "Deleted Successfully",
    }).send(res);
  };

  getUserInfo = async (req, res) => {
    const user = await this.userService.getUserInfo(req.userId);
    new OK({
      message: "Successfully",
      metadata: user,
    }).send(res);
  };
}
