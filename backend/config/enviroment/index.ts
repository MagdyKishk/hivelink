import dotenv from "dotenv";

dotenv.config();

/**
 * Environment configuration object
 * Contains server configuration details loaded from environment variables
 */
const enviromentConfig = {
  /** Node environment */
  NODE_ENV: process.env.NODE_ENV || "",
  /** Port number the server will listen on */
  PORT: process.env.PORT || "",
  /** URL where the server can be accessed */
  SERVER_URL: process.env.SERVER_URL || "",
  /** Port number the frontend will listen on */
  FRONTEND_PORT: process.env.FRONTEND_PORT || "",
  /** URL where the frontend can be accessed */
  FRONTEND_URL: `${process.env.SERVER_URL}:${process.env.FRONTEND_PORT}`,
} as const;

export default enviromentConfig;
