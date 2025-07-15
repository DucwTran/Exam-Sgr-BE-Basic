import { OK } from "../handlers/success.response.js";

export default class EventController {
  constructor(EventService) {
    this.eventService = EventService;
  }

  // Tạo sự kiện mới
  createEvent = async (req, res) => {
    const { title, description, location, startTime, endTime } = req.body;
    const imagePath = req.file ? `/img/${req.file.filename}` : "";
    const data = {
      title,
      description,
      location,
      image: imagePath,
      startTime,
      endTime,
      createdBy: req.userId,
    };

    const event = await this.eventService.createEvent(data);
    new OK({
      message: "Create event successfully",
      metadata: event,
    }).send(res);
  };

  // Lấy danh sách sự kiện có phân trang
  getAllEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await this.eventService.getAllEvents({ page, limit });
    new OK({
      message: "Get all events successfully",
      metadata: {
        data: result.events,
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    }).send(res);
  };

  // Lấy chi tiết một sự kiện
  getEventById = async (req, res) => {
    const { id } = req.params;
    const event = await this.eventService.getEventById(id);
    new OK({
      message: "Get event successfully",
      metadata: event,
    }).send(res);
  };

  // Cập nhật sự kiện
  updateEvent = async (req, res) => {
    const { id } = req.params;
    const updated = await this.eventService.updateEvent(id, req.body);
    new OK({
      message: "Update event successfully",
      metadata: updated,
    }).send(res);
  };

  // Xóa sự kiện
  deleteEvent = async (req, res) => {
    const { id } = req.params;
    const result = await this.eventService.deleteEvent(id);
    new OK({
      message: "Delete event successfully",
      metadata: result,
    }).send(res);
  };

  // Khóa sự kiện
  lockEvent = async (req, res) => {
    const { id } = req.params;
    const updated = await this.eventService.lockEvent(id);
    new OK({
      message: "Lock event successfully",
      metadata: updated,
    }).send(res);
  };

  // Mở khóa sự kiện
  unlockEvent = async (req, res) => {
    const { id } = req.params;
    const updated = await this.eventService.unlockEvent(id);
    new OK({
      message: "Unlock event successfully",
      metadata: updated,
    }).send(res);
  };
}
