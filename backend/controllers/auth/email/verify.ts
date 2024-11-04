import { Response } from "express";
import { AuthedRequest } from "../../../middleware/auth/checkAuth";
import { HTTP_STATUS } from "../../../constants/httpStatus";
import { MESSAGES } from "../../../constants/messages";
import { Email } from "../../../models";
import Logger from "../../../util/logger";
import { enviromentConfig } from "../../../config";

interface VerifyEmailRequest extends AuthedRequest {
  body: {
    verificationCode: string;
  };
}

export default async (req: VerifyEmailRequest, res: Response) => {
  const currentUser = req.user;
  const { verificationCode } = req.body;

  if (!verificationCode) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.INVALID_CODE,
    });
    return;
  }

  try {
    // get target email
    const targetEmail = await Email.findOne({
      _id: { $in: currentUser.emails },
      verifyCode: verificationCode,
    });

    if (!targetEmail) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.INVALID_CODE,
      });
      return;
    }

    if (targetEmail.verified) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.ALREADY_VERIFIED,
      });
      return;
    }

    // Check if verification code has expired
    if (
      targetEmail.verifyCodeExpireDate &&
      targetEmail.verifyCodeExpireDate < new Date()
    ) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.EMAIL.VERIFICATION.EXPIRED_CODE,
      });
      return;
    }

    // update the data
    targetEmail.verified = true;
    targetEmail.verifyCodeExpireDate = undefined;
    targetEmail.verifyCode = undefined;

    // Save target email
    await targetEmail.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.AUTH.EMAIL_VERIFICATION,
      data: {
        email: targetEmail,
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
