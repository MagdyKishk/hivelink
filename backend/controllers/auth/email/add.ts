import { Response } from "express";
import { AuthedRequest } from "../../../middleware/auth/checkAuth";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";
import { Email } from "../../../models";
import Logger from "../../../util/logger";
import { enviromentConfig } from "../../../config";
import validator from "../../../validator";
import EmailService from "../../../services";

interface AddEmailRequest extends AuthedRequest {
  body: {
    email?: string;
  };
}

export default async (req: AddEmailRequest, res: Response) => {
  const currentUser = req.user;
  const { email } = req.body;

  if (!email) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.REQUIRED_FIELDS,
    });
    return;
  }

  if (!Email.validateAddress(email)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.VALIDATION.EMAIL.FORMAT,
    });
    return;
  }

  try {
    // Check if email already exist
    if (await Email.exists({ address: email })) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.ALREADY_EXIST,
      });
      return;
    }

    if (currentUser.emails.length >= validator.email.regex.maximumEmails) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.MAXIMUM_EMAILS,
      });
      return;
    }

    // Create new email
    const newEmail = await Email.create({
      userId: currentUser._id,
      address: email,
    });

    // Add new email to user document
    currentUser.emails.push(newEmail._id);
    await currentUser.save();

    EmailService.sendVerificationCode(
      email,
      `${currentUser.firstName} ${currentUser.lastName}`,
      newEmail.verifyCode!
    );

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.AUTH.EMAIL.REMOVED,
      data: {
        email: {
          _id: newEmail._id,
          address: newEmail.address,
          verified: newEmail.verified,
          createdAt: newEmail.createdAt,
        },
      },
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
