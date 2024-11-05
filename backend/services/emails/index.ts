import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { emailServiceConfig } from "../../config";
import pug from "pug";
import path from "path";
import Logger from "../../util/logger";

dotenv.config();

// Use __dirname directly since we're in CommonJS
const templatePath = path.join(__dirname, "templates", "verificationCode.pug");

// Create transporter outside the function so it's reused
const transporter = nodemailer.createTransport({
  service: emailServiceConfig.MAIL_SERVICE, // or your preferred service
  auth: {
    user: emailServiceConfig.MAIL_USER,
    pass: emailServiceConfig.MAIL_APP_PASSWORD, // Your app password
  },
});

async function sendVerificationCode(
  to: string,
  username: string,
  verificationCode: string
) {
  const msg = {
    to,
    from: emailServiceConfig.MAIL_SENDER,
    subject: "LucidRealm Email Verification Code",
    html: pug.renderFile(templatePath, {
      username,
      verificationCode,
    }),
  };

  try {
    await transporter.sendMail(msg);
    Logger.debug(`A email with the verification code has been sent to ${to}`);
  } catch (error) {
    Logger.debug(
      `Error happened while trying to send verification code to ${to}: ${error}`
    );
    throw error;
  }
}

// Verify transporter connection on startup
transporter
  .verify()
  .then(() => {
    Logger.debug("Email transporter is ready to send emails");
  })
  .catch((error) => {
    Logger.error(`Email transporter verification failed: ${error}`);
  });

export { sendVerificationCode };
