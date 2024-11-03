import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../constants/httpStatus';
import { enviromentConfig } from '../../config';
import { JwtToken } from '../../models';
import { MESSAGES } from '../../constants/messages';
import Logger from '../../util/logger';
import { clearRefreshTokenCookie } from '../../util/cookies/tokenCookie';
export default async (req: Request, res: Response) => {
  const refreshToken = req.signedCookies.refreshToken;

  try {
    if (refreshToken) {
      // Invalidate refresh token in database
      await JwtToken.deleteOne({ value: refreshToken });
    }

    // Clear cookies
    clearRefreshTokenCookie(res);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.LOGOUT,
    });
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
    });
  }
};
