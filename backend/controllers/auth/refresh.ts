import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import { enviromentConfig, jwtConfig } from "../../config";
import Logger from "../../util/logger";
import { JwtToken, User } from "../../models";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { setRefreshTokenCookie } from "../../util/cookies/tokenCookie";

export default async (req: Request, res: Response) => {
  const refreshToken = req.signedCookies.refreshToken;

  if (!refreshToken) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.AUTH.TOKEN.INVALID_REFRESH_TOKEN,
    });
    return;
  }

  try {
    const targetJwtRefreshToken = await JwtToken.findOne({
      value: refreshToken,
      expiresDate: { $gt: new Date() },
    });

    if (!targetJwtRefreshToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.TOKEN.INVALID_REFRESH_TOKEN,
      });
      return;
    }

    // Implement token rotation - invalidate old refresh token
    await JwtToken.deleteOne({ _id: targetJwtRefreshToken._id });

    const decodedToken = Jwt.verify(
      refreshToken,
      jwtConfig.JWT_REFRESH_SECRET
    ) as JwtPayload;

    // Create new tokens
    const [newAccessToken, newRefreshToken] = await Promise.all([
      JwtToken.createAccessToken(decodedToken.userId),
      JwtToken.createRefreshToken(decodedToken.userId),
    ]);

    // Update user's tokens
    await User.findByIdAndUpdate(decodedToken.userId, {
      $push: { 
        'tokens.access': newAccessToken._id,
        'tokens.refresh': newRefreshToken._id 
      }
    });

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    // Send new access token in response
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.REFRESHED_ACCESS_TOKEN,
      data: {
        accessToken: newAccessToken.value,
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
