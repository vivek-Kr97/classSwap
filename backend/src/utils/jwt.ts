import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "./../config/env";
import { UserRole } from "./../constants/roles";

export interface JwtTokenPayload {
  sub: string;
  role: UserRole;
}

export const generateAccessToken = (userId: string, role: UserRole): string => {
  const payload: JwtTokenPayload = { sub: userId, role };
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

export const generateRefreshToken = (
  userId: string,
  role: UserRole,
): string => {
  const payload: JwtTokenPayload = { sub: userId, role };
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtTokenPayload;
};

export const verifyRefreshToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtTokenPayload;
};
