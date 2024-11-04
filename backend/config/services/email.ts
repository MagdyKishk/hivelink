import dotenv from "dotenv";

dotenv.config();

const emailServiceConfig = {
  API_KEY: process.env.SENDGRID_API_KEY || "",
  SENDER_EMAIL: process.env.SENDER_EMAIL || "",
} as const;

export default emailServiceConfig;
