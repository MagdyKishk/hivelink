import dotenv from "dotenv";

dotenv.config();

const emailServiceConfig = {
  // API_KEY: process.env.SENDGRID_API_KEY || "",
  // SENDER_EMAIL: process.env.SENDER_EMAIL || "",

  MAIL_SERVICE: process.env.MAIL_SERVICE || "",
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_APP_PASSWORD: process.env.MAIL_APP_PASSWORD || "",
  MAIL_SENDER: process.env.MAIL_SENDER || "", 
} as const;

export default emailServiceConfig;
