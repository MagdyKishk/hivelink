import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { enviromentConfig, jwtConfig } from "../../config";
import { User, UserDocument } from "../../models";
import Logger from "../../util/logger";

interface AuthedRequest extends Request {
  user: UserDocument;
  accessToken?: string;
}
export type { AuthedRequest };

export default async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.AUTH.TOKEN.INVALID,
    });
    return;
  }

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      jwtConfig.JWT_ACCESS_SECRET
    ) as JwtPayload;

    if (!decodedAccessToken) {
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

    req.user = targetUser;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      Logger.debug(error);
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.ERROR.AUTH.TOKEN.INVALID,
        error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
      });
      return;
    }
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR.SYSTEM.INTERNAL_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};
