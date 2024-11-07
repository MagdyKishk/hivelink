import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { enviromentConfig, jwtConfig } from "../../config";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import { JwtToken, User } from "../../models";
import Logger from "../../util/logger";

interface CheckAuthRequest extends Request {
  body: {
    accessToken?: string;
  };
}

export default async (req: CheckAuthRequest, res: Response) => {
  Logger.debug("Request Checking Auth");
  const { accessToken } = req.body;

  if (!accessToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.AUTH.TOKEN.INVALID,
    });
    return;
  }

  try {
    // Verify the token first
    const decodedAccessToken = jwt.verify(
      accessToken,
      jwtConfig.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // Get target token from database and verify it exists and is not expired
    const targetToken = await JwtToken.findOne({
      value: accessToken,
      expiresDate: { $gt: new Date() },
    });

    if (!targetToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.TOKEN.INVALID,
      });
      return;
    }

    // Get target user
    const targetUser = await User.findById(decodedAccessToken.userId);

    if (!targetUser) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.USER.NOT_FOUND,
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.AUTH.CHECK,
      data: {
        user: {
          _id: targetUser._id,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          username: targetUser.username,
          createdAt: targetUser.createdAt,
          updatedAt: targetUser.updatedAt,
          dreams: targetUser.dreams,
        },
      },
    });
  } catch (error) {
    Logger.error(error);
    // If token verification fails, return unauthorized
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.TOKEN.INVALID,
      });
      return;
    }
    // For other errors, return internal server error
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR.SYSTEM.INTERNAL_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};
