import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { MESSAGES } from "../../constants/messages";
import { enviromentConfig } from "../../config";
import { Email, JwtToken, Password, User } from "../../models";
import Logger from "../../util/logger";
import { setRefreshTokenCookie } from "../../util/cookies/tokenCookie";
import EmailService from "../../services";

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

  Logger.debug(
    `Signup Requested: { firstName: ${firstName}, lastName: ${lastName}, email: ${email}, password: [hidden]}`
  );

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

    // hash the password and create new email in paralel
    const [hashedPassword, newEmail] = await Promise.all([
      await Password.hashPassword(password),
      await Email.create({ address: email }),
    ]);

    // Create password from hash
    const newPassword = await Password.create({ hash: hashedPassword });

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
    setRefreshTokenCookie(res, newRefreshToken);

    Logger.debug(
      `Signup request fullfiled: {userId: ${newUser._id}, username: ${newUser.username}}`
    );

    EmailService.sendVerificationCode(
      email,
      `${firstName} ${lastName}`,
      newEmail.verifyCode!
    );

    // Return final response
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.SUCCESS.SIGNUP,
      data: {
        accessToken: newAccessToken.value,
        user: {
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          username: newUser.username,
          tokens: {
            access: {
              expiresDate: newAccessToken.expiresDate,
            },
            refresh: {
              expiresDate: newRefreshToken.expiresDate,
            },
          },
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
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
