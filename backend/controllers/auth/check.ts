import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { enviromentConfig, jwtConfig } from "../../config";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import { JwtToken, User } from "../../models";
import Logger from "../../util/logger";

interface CheckAuthRequest extends Request {}

export default async (req: CheckAuthRequest, res: Response) => {
  Logger.debug("Request Checking Auth");
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH.MISSING_AUTH_HEADER,
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    // Get target token
    const targetToken = await JwtToken.findOne({
      value: token,
      expiresDate: { $gt: new Date() },
    });

    if (!targetToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.TOKEN.INVALID_ACCESS_TOKEN,
      });
      return;
    }

    // Verify the token instead of just decoding it
    const decodedAccessToken = jwt.verify(
      token,
      jwtConfig.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // Check if the decoded token exists
    if (!decodedAccessToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.TOKEN.INVALID_ACCESS_TOKEN,
      });
      return;
    }

    // Get target user
    const targetUser = await User.findById(decodedAccessToken.userId);

    if (!targetUser) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message:
          MESSAGES.AUTH.USER_DOES_NOT_EXIST ||
          "The associated user account does not exist or has been deactivated.",
      });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true, // Should be true on success
      message: MESSAGES.AUTH.USER_IS_AUTHENTICATED,
      data: {
        user: {
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          username: targetUser.username,
          createdAt: targetUser.createdAt,
          updatedAt: targetUser.updatedAt,
        },
      },
    });
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};
