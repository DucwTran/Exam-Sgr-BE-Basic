import { Router } from "express";
import RegistrationController from "../controllers/registration.controller.js";
import RegistrationService from "../services/registration.service.js";
import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import AuthValidator from "../middlewares/auth.middleware.js";

export default class RegistrationRoute {
  constructor() {
    this.router = Router();
    this.authValidator = new AuthValidator();
    this.registrationController = new RegistrationController(
      new RegistrationService(Event, Registration)
    );
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST] Đăng ký tham gia sự kiện
    this.router.post(
      "/:id/register",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.registrationController.createRegistration)
    );

    // [DELETE] Hủy đăng ký sự kiện
    this.router.delete(
      "/:id/register",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.registrationController.deleteRegistration)
    );

    // [GET] Xem all sự kiện
    this.router.get(
      "/:id/registrations",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.registrationController.getRegistrationsByEvent)
    );
  }

  getRoute() {
    return this.router;
  }
}
