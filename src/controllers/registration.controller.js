import { OK } from "../handlers/success.response.js";

export default class RegistrationController {
  constructor(RegistrationService) {
    this.registrationService = RegistrationService;
  }

  createRegistration = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.userId;
    const registration = await this.registrationService.createRegistration({
      userId,
      eventId,
    });

    new OK({
      message: "Registration successful",
      metadata: registration,
    }).send(res);
  };

  deleteRegistration = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.userId;

    const deleted = await this.registrationService.deleteRegistration({
      userId,
      eventId,
    });

    new OK({
      message: "Unregistered from event successfully",
      metadata: deleted,
    }).send(res);
  };

  getRegistrationsByEvent = async (req, res) => {
    const eventId = req.params.id;
    const registrations =
      await this.registrationService.getRegistrationsByEventId(eventId);

    new OK({
      message: "Lấy danh sách người đăng ký thành công",
      metadata: registrations,
    }).send(res);
  };
}
