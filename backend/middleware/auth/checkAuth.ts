import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import jwt, { JwtPayload } from "jsonwebtoken";
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
      message: MESSAGES.AUTH.TOKEN.INVALID_ACCESS_TOKEN,
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
        message: MESSAGES.AUTH.TOKEN.INVALID_ACCESS_TOKEN,
      });
      return;
    }
  
    // Get target user
    const targetUser = await User.findById(decodedAccessToken.userId);

    if (!targetUser) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.USER_DOES_NOT_EXIST,
      });
      return;
    }

    req.user = targetUser;
    next();
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};
