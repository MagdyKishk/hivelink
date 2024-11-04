import { Response } from "express";
import { AuthedRequest } from "../../../middleware/auth/checkAuth";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";
import { Email } from "../../../models";
import Logger from "../../../util/logger";
import { enviromentConfig } from "../../../config";
import mongoose from "mongoose";

interface RemoveEmailRequest extends AuthedRequest {
  body: {
    emailId?: string;
  };
}

export default async (req: RemoveEmailRequest, res: Response) => {
  const currentUser = req.user;
  const { emailId } = req.body;

  if (!(emailId && mongoose.Types.ObjectId.isValid(emailId))) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.EMAIL.INVALID_ID,
    });
    return;
  }

  if (!currentUser.emails.some((id) => id.toString() == emailId)) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.NOT_OWNED,
    });
    return;
  }

  try {
    // Check if this is the user's last email
    if (currentUser.emails.length <= 1) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.LAST_EMAIL,
      });
      return;
    }

    // Remove email from user's emails array
    currentUser.emails = currentUser.emails.filter(
      (id) => id.toString() !== emailId
    );

    // Delete the email document and save user
    await Promise.all([currentUser.save(), Email.findByIdAndDelete(emailId)]);

    res.status(HTTP_STATUS.NO_CONTENT).json({
      success: true,
      message: MESSAGES.SUCCESS.AUTH.EMAIL.REMOVED,
    });
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR.SYSTEM.INTERNAL_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};
