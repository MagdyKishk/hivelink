import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import { emailServiceConfig } from "../../config";
import pug from "pug";
import path from "path";
import Logger from "../../util/logger";

dotenv.config();

// Use __dirname directly since we're in CommonJS
const templatePath = path.join(__dirname, "templates", "verificationCode.pug");
sgMail.setApiKey(emailServiceConfig.API_KEY);

async function sendVerificationCode(
  to: string,
  username: string,
  verificationCode: string
) {
  const msg = {
    to,
    from: emailServiceConfig.SENDER_EMAIL,
    subject: "LucidRealm Email Verification Code",
    html: pug.renderFile(templatePath, {
      username,
      verificationCode,
    }),
  };

  try {
    await sgMail.send(msg);
    Logger.debug(`A email with the verification code has been send to ${to}`)
  } catch (error) {
    Logger.debug(`Error happened while trying to send verification code to ${to} :${error}`)
    throw error;
  }
}

export { sendVerificationCode };
