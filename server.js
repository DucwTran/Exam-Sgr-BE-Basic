import dotenv from "dotenv";
import connect from "./src/config/database.js";
import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/handlers/error-handle.js";
import setupRoutes from "./src/routes/index.route.js";

dotenv.config();
const app = express();
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/img", express.static("src/public/img"));

setupRoutes(app);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
