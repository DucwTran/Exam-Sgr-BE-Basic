import mongoose from "mongoose";

export default class RegistrationService {
  constructor(Event, Registration) {
    this.eventModel = Event;
    this.registrationModel = Registration;
  }

  createRegistration = async ({ userId, eventId }) => {
    const event = await this.eventModel.findById(eventId);

    if (!event) throw new Error("Event not found");
    if (event.isLocked) throw new Error("Event is locked");

    // Kiểm tra đã đăng ký chưa
    const existed = await this.registrationModel.findOne({ userId, eventId });
    if (existed) throw new Error("You have already registered for this event");

    return await this.registrationModel.create({ userId, eventId });
  };

  deleteRegistration = async ({ userId, eventId }) => {
    const event = await this.eventModel.findById(eventId);

    if (!event) throw new Error("Event not found");
    if (event.isLocked) throw new Error("Event is locked");

    const deleted = await this.registrationModel.findOneAndDelete({
      userId,
      eventId,
    });
    if (!deleted) throw new Error("Registration not found");
    return deleted;
  };

  getRegistrationsByEventId = async (eventId) => {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundError("Event not found");

    const registrations = await this.registrationModel
      .find({ eventId })
      .populate("userId", "email _id")
      .lean();

    return registrations.map((r) => ({
      id: r._id,
      user: r.userId,
      registeredAt: r.createdAt,
    }));
  };
}
