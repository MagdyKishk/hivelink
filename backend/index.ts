import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import { AuthRouter } from "./routes"

// Winston Logger
import Logger from "./util/logger";

// Config
import { cookieConfig, enviromentConfig } from "./config";

// Database
import db from "./database";
import { requestLogger } from "./middleware/requestLogger";
import DreamRouter from "./routes/dream.routes";

// Jobs

// Load enviroment variables into process.env
dotenv.config();

// Create main app
const app = express();

// Global Middlewares
app.use(express.json()); // loads json bodies in req.body
app.use(cors()); // allow multi origin requests from specified origins
app.use(cookieParser(cookieConfig.COOKIES_SECRET)); // loads cookies in req.cookies
app.use(requestLogger); // logs all requests

// db
db.connect();

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/dream", DreamRouter)

// Jobs

// Listen on specified port
app.listen(enviromentConfig.PORT, () => {
  Logger.info(
    `Server started listing on specified port ${enviromentConfig.PORT}`
  );
});
