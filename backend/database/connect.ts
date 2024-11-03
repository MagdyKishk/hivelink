import mongoose from "mongoose";

// Database url and its creds
import { databaseConfig } from "../config";

// Winston Logger
import Logger from "../util/logger";

export default async () => {
  try {
    Logger.info("Attempting to connect to mongoodb ....");
    await mongoose.connect(databaseConfig.DB_URL, {
      appName: databaseConfig.DB_APP_NAME,
    });
    Logger.info("Connected to mongoodb");
  } catch (error) {
    Logger.error(`Error while trying to connect to mongoodb server ${error}`);
    Logger.info(`Process will exit`);
    process.exit(-1);
  }
};
