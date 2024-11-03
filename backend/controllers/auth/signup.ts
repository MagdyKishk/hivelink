import { Request, Response } from "express";
import validator from "../../validator";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import Logger from "../../util/logger";
import { enviromentConfig } from "../../config";
import { Email, JwtToken, Password, User } from "../../models";

interface SignupRequest extends Request {
  body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
}

export default async (req: SignupRequest, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate data
  if (!firstName || !lastName || !email || !password) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.REQUIRED_FIELDS,
    });
    return;
  }
  if (!User.validateFirstName(firstName)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.USER.FIRSTNAME,
    });
    return;
  }
  if (!User.validateLastName(lastName)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.USER.LASTNAME,
    });
    return;
  }
  if (!Email.validateAddress(email)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.EMAIL.ADDRESS,
    });
    return;
  }
  if (!Password.validatePassword(password)) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.VALIDATION.PASSWORD,
    });
    return;
  }

  try {
    // Check if email exists
    if (await Email.exists({ address: email })) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.VALIDATION.EMAIL.EXISTS,
      });
      return;
    }

    // Create password
    const hashedPassword = await Password.hashPassword(password);
    const newPassword = await Password.create({ hash: hashedPassword });

    // Create new email
    const newEmail = await Email.create({ address: email });

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      emails: [newEmail._id],
      passwords: {
        history: [newPassword._id],
        current: newPassword._id,
      },
    });

    // Save userId to email
    newEmail.userId = newUser._id; // will save later

    // Create access and refresh tokens
    const [newAccessToken, newRefreshToken] = await Promise.all([
      JwtToken.createAccessToken(newUser._id),
      JwtToken.createRefreshToken(newUser._id),
    ]);

    // Adding the tokens to the user document
    newUser.tokens.access.push(newAccessToken._id);
    newUser.tokens.refresh.push(newRefreshToken._id);

    // Saving newUser and newEmail
    await Promise.all([newEmail.save(), newUser.save()]);

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

    // Return final response
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.SIGNUP,
      data: {
        user: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          tokens: {
            access: {
              expiresDate: newAccessToken.expiresData,
            },
            refresh: {
              expiresDate: newRefreshToken.expiresData,
            },
          },
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.GENERAL.INTERNAL_SERVER_ERROR,
      error: enviromentConfig.NODE_ENV === "development" ? error : undefined,
    });
  }
};
