import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET not defined');

  return jwt.sign({ userId }, secret, {
    expiresIn: '15m',
  });
};

export const verifyAccessToken = (token: string) => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET not defined');

  return jwt.verify(token, secret);
};

export const generateRefreshToken = (userId: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not defined');

  return jwt.sign({ userId }, secret, {
    expiresIn: '7d',
  });
};

export const verifyRefreshToken = (token: string) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET not defined');

  return jwt.verify(token, secret);
};

export const generateResetToken = (userId: string) => {
  const secret = process.env.JWT_RESET_SECRET;
  if (!secret) throw new Error('JWT_RESET_SECRET not defined');

  return jwt.sign({ userId }, secret, {
    expiresIn: '10m',
  });
};

export const verifyResetToken = (token: string) => {
  const secret = process.env.JWT_RESET_SECRET;
  if (!secret) throw new Error('JWT_RESET_SECRET not defined');

  return jwt.verify(token, secret);
};
