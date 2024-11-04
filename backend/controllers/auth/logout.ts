import { Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { JwtToken, User } from "../../models";
import { MESSAGES } from "../../constants/messages";
import Logger from "../../util/logger";
import { clearRefreshTokenCookie } from "../../util/cookies/tokenCookie";
import type { AuthedRequest } from "../../middleware/auth/checkAuth";

export default async (req: AuthedRequest, res: Response) => {
  const refreshToken = req.signedCookies.refreshToken;
  const userId = req.user._id;

  try {
    if (refreshToken) {
      // Find and invalidate refresh token in database
      const token = await JwtToken.findOne({ value: refreshToken });
      if (token) {
        await JwtToken.deleteOne({ _id: token._id });

        // Remove token reference from user
        await User.findByIdAndUpdate(userId, {
          $pull: {
            "tokens.refresh": token._id,
          },
        });
      }
    }

    // Clear cookies
    clearRefreshTokenCookie(res);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.SUCCESS.AUTH.LOGOUT,
    });
  } catch (error) {
    Logger.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.ERROR.SYSTEM.INTERNAL_ERROR,
    });
  }
};
