import { Router } from "express";
import AuthValidator from "../middlewares/auth.middleware.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Registration from "../models/registration.model.js";
import EventService from "../services/event.service.js";
import EventController from "../controllers/event.controller.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import uploadStorage from "../config/multer.config.js";

export default class EventRoute {
  constructor() {
    this.router = Router();
    this.authValidator = new AuthValidator();
    this.eventController = new EventController(
      new EventService(Event, User, Registration)
    );
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST] Tạo sự kiện mới (admin)
    this.router.post(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      uploadStorage.single("image"),
      asyncHandler(this.eventController.createEvent)
    );

    // [GET] Lấy danh sách tất cả sự kiện (user & admin)
    this.router.get(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.eventController.getAllEvents)
    );

    // [GET] Lấy chi tiết sự kiện theo ID (user & admin)
    this.router.get(
      "/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.eventController.getEventById)
    );

    // [PUT] Cập nhật sự kiện (admin)
    this.router.put(
      "/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.eventController.updateEvent)
    );

    // [DELETE] Xóa sự kiện (admin)
    this.router.delete(
      "/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.eventController.deleteEvent)
    );

    // [PUT] Khóa sự kiện (admin)
    this.router.put(
      "/lock/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.eventController.lockEvent)
    );

    // [PUT] Mở khóa sự kiện (admin)
    this.router.put(
      "/unlock/:id",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.authValidator.checkAdmin),
      asyncHandler(this.eventController.unlockEvent)
    );
  }

  getRoute() {
    return this.router;
  }
}
