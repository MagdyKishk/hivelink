import dotenv from "dotenv";

dotenv.config();

/**
 * Database configuration object
 * Contains database connection details and credentials loaded from environment variables
 */
const databaseConfig = {
  /** Name of the database */
  DB_NAME: process.env.DB_NAME || "",
  /** Username for database authentication */
  DB_USER: process.env.DB_USER || "",
  /** Password for database authentication */
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  /** Application name identifier in the database */
  DB_APP_NAME: process.env.DB_APP_NAME || "",
  /** Full MongoDB connection string constructed from credentials */
  DB_URL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
} as const;

export default databaseConfig;
