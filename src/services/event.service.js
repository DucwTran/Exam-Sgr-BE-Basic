import { BadRequestError, NotFoundError } from "../handlers/error.response.js";
import mongoose from "mongoose";

export default class EventService {
  constructor(EventModel, UserModel) {
    this.eventModel = EventModel;
    this.userModel = UserModel;
  }

  // Tạo sự kiện mới
  createEvent = async (data) => {
    if (!data.title || !data.startTime || !data.endTime || !data.createdBy) {
      throw new BadRequestError("Thiếu thông tin bắt buộc của sự kiện");
    }

    if (new Date(data.endTime) <= new Date(data.startTime)) {
      throw new BadRequestError("endTime phải sau startTime");
    }

    return await this.eventModel.create(data);
  };

  // Lấy danh sách tất cả sự kiện có phân trang
  getAllEvents = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.eventModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "fullName _id")
        .sort({ createdAt: -1 })
        .lean(),
      this.eventModel.countDocuments(),
    ]);

    const formatted = events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      location: event.location,
      image: event.image,
      startTime: event.startTime,
      endTime: event.endTime,
      isLocked: event.isLocked,
      creator: {
        id: event.createdBy._id,
        fullName: event.createdBy.fullName,
      },
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    return {
      events: formatted,
      total,
      page,
      limit,
    };
  };

  // Lấy sự kiện theo ID
  getEventById = async (eventId) => {
    const event = await this.eventModel
      .findById(eventId)
      .populate("createdBy", "fullName _id")
      .lean();

    if (!event) throw new NotFoundError("Event not found");

    return {
      id: event._id,
      title: event.title,
      description: event.description,
      location: event.location,
      image: event.image,
      startTime: event.startTime,
      endTime: event.endTime,
      isLocked: event.isLocked,
      creator: {
        id: event.createdBy._id,
        fullName: event.createdBy.fullName,
      },
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  };

  // Cập nhật sự kiện
  updateEvent = async (eventId, data) => {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundError("Event not found");

    if (data.startTime && data.endTime) {
      if (new Date(data.endTime) <= new Date(data.startTime)) {
        throw new BadRequestError("endTime phải sau startTime");
      }
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "image",
      "startTime",
      "endTime",
      "isLocked",
    ];

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        event[key] = data[key];
      }
    }

    await event.save();
    return event;
  };

  // Xóa sự kiện
  deleteEvent = async (eventId) => {
    const event = await this.eventModel.findById(eventId);
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    await this.eventModel.deleteOne({ _id: eventId });

    // Xóa tất cả đăng ký liên quan đến sự kiện này
    await this.registrationModel.deleteMany({ eventId });

    return await this.registrationModel.deleteMany({ eventId });
  };

  // Khóa sự kiện
  lockEvent = async (id) => {
    return await this.eventModel.findByIdAndUpdate(
      id,
      { isLocked: true },
      { new: true }
    );
  };

  // Mở khóa sự kiện
  unlockEvent = async (id) => {
    return await this.eventModel.findByIdAndUpdate(
      id,
      { isLocked: false },
      { new: true }
    );
  };
}
