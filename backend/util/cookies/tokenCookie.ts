import { Response } from 'express';
import { enviromentConfig } from '../../config';
import { JwtTokenDocument } from '../../models/types/token.model';

export const setRefreshTokenCookie = (
  res: Response,
  refreshToken: JwtTokenDocument
) => {
  res.cookie("refreshToken", refreshToken.value, {
    httpOnly: true,
    secure: enviromentConfig.NODE_ENV === "production",
    maxAge: refreshToken.expiresDate.getTime() - Date.now(),
    sameSite: 'strict',
    signed: true,
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: enviromentConfig.NODE_ENV === "production",
    sameSite: 'strict',
  });
}; 