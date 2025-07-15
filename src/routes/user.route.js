import { Router } from "express";
import User from "../models/user.model.js";
import UserController from "../controllers/user.controller.js";
import UserService from "../services/user.service.js";
import UserValidator from "../middlewares/user.middleware.js";
import AuthUtil from "../utils/auth.utils.js";
import AuthValidator from "../middlewares/auth.middleware.js";
import asyncHandler from "../middlewares/asyncHandle.js";

export default class UserRoute {
  constructor() {
    this.router = Router();
    this.userController = new UserController(
      new UserService(User, new AuthUtil())
    );
    this.userValidator = new UserValidator();
    this.authValidator = new AuthValidator();
    this.setupRoutes();
  }
  setupRoutes() {
    // [GET] get all users (Admin)
    this.router.get(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.userController.getAllUsers)
    );
    // [GET] get profile (Admin and User)
    this.router.get(
      "/me",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.userController.getUserInfo)
    );
    // [GET] get user by id
    this.router.get(
      "/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.userController.getUserById)
    );
    // [POST] create new user (Admin)
    this.router.post(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.userValidator.checkInput),
      asyncHandler(this.userController.postUser)
    );
    // [PUT] update user by id (Admin || User with same id)
    this.router.put(
      "/:id",
      asyncHandler(this.authValidator.checkUpdateProfile),
      asyncHandler(this.userController.putUser)
    );
    // [DELETE] delete user by id (Admin)
    this.router.delete(
      "/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.userController.deleteUser)
    );
  }

  getRoute() {
    return this.router;
  }
}
