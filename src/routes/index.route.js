import UserRoute from "./user.route.js";
import AuthRoute from "./auth.route.js";
import EventRoute from "./event.route.js";
import RegistrationRoute from "./registration.route.js";

const setupRoutes = (app) => {
  const userRoute = new UserRoute();
  const authRoute = new AuthRoute();
  const eventRoute = new EventRoute();
  const registrationRoute = new RegistrationRoute();

  app.use("/api/v1/users", userRoute.getRoute());
  app.use("/api/v1/auth", authRoute.getRoute());
  app.use("/api/v1/events", eventRoute.getRoute());
  app.use("/api/v1/events", registrationRoute.getRoute());
};
export default setupRoutes;
