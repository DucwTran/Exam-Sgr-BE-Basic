import { Router } from "express";
import User from "../models/user.model.js";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";
import AuthUtil from "../utils/auth.utils.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import AuthValidator from "../middlewares/auth.middleware.js";

export default class AuthRoute {
  constructor() {
    this.router = Router();
    this.authController = new AuthController(
      new AuthService(User, new AuthUtil())
    );
    this.authValidator = new AuthValidator();
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST] /register
    this.router.post(
      "/register",
      asyncHandler(this.authValidator.registerValidate),
      asyncHandler(this.authController.register)
    );

    // [POST] /login
    this.router.post(
      "/login",
      asyncHandler(this.authValidator.loginValidate),
      asyncHandler(this.authController.login)
    );

    // [POST] /processNewToken
    this.router.post(
      "/processNewToken",
      asyncHandler(this.authController.processNewToken)
    );

    // [POST] /logout
    this.router.post(
      "/logout",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authController.logout)
    );

    // [POST] /forgot-password
    this.router.post(
      "/forgot-password",
      asyncHandler(this.authController.forgotPassword)
    );

    // [POST] /verify-otp
    this.router.post(
      "/verify-otp",
      asyncHandler(this.authController.verifyOtp)
    );

    // [GET] /test-ec2
    this.router.get("/test-ec2", asyncHandler(this.authController.testEc2));
  }
  getRoute() {
    return this.router;
  }
}
