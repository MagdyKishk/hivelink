import { Request, Response } from "express";
import Logger from "../../util/logger";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import { Email, JwtToken, Password, User } from "../../models";
import validator from "../../validator";
import { enviromentConfig } from "../../config";

interface LoginRequest extends Request {
  body: {
    email?: string;
    password?: string;
  };
}

export default async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;
  Logger.debug(`Login Attempt using email: ${email}`);

  if (!email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.REQUIRED_FIELDS,
    });
    return;
  }

  if (!Email.validateAddress(email)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.EMAIL,
    });
    return;
  }

  if (!validator.password.regex.minPassword.test(password)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Invalid Password",
    });
    return;
  }

  try {
    // get target email
    const targetEmail = await Email.findOne({ address: email });

    if (!targetEmail) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.INVALID_CREDS,
      });
      return;
    }

    // get target user
    const targetUser = await User.findById(targetEmail.userId);

    if (!targetUser) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.USER_DOES_NOT_EXIST,
      });
      return;
    }

    // get target user password
    const targetPassword = await Password.findById(
      targetUser.passwords.current
    );

    
    if (!targetPassword) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.USER_DOES_NOT_EXIST,
      });
      return;
    }
    
    const isValidPassword = await targetPassword.compare(password);
    if (!isValidPassword) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.AUTH.INVALID_CREDS,
      });
      return;
    }

    const [newAccessToken, newRefreshToken] = await Promise.all([
      JwtToken.createAccessToken(targetUser._id),
      JwtToken.createRefreshToken(targetUser._id),
    ]);

    // Adding the tokens to the user document
    targetUser.tokens.access.push(newAccessToken._id);
    targetUser.tokens.refresh.push(newRefreshToken._id);

    // Saving newUser and newEmail
    await targetUser.save();

    // Store tokens in cookies
    res.cookie("accessToken", newAccessToken.value, {
      httpOnly: true,
      secure: enviromentConfig.NODE_ENV === "production",
      maxAge: +newAccessToken.expiresData,
      signed: true,
    });

    res.cookie("refreshToken", newRefreshToken.value, {
      httpOnly: true,
      secure: enviromentConfig.NODE_ENV === "production",
      maxAge: +newRefreshToken.expiresData,
      signed: true,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true, // Should be true on success
      message: MESSAGES.AUTH.USER_IS_AUTHENTICATED,
      data: {
        user: {
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          username: targetUser.username,
          tokens: {
            access: {
              expiresDate: newAccessToken.expiresData,
            },
            refresh: {
              expiresDate: newRefreshToken.expiresData,
            },
          },
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
