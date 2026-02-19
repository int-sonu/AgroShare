import crypto from 'crypto';
import * as userRepository from '../repositories/user.repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
} from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { sendResetEmail } from './email.service.js';

export const register = async (data: any) => {
  const emailExists = await userRepository.findByEmail(data.email);
  if (emailExists) throw new Error('Email already registered');

  const phoneExists = await userRepository.findByPhone(data.phone);
  if (phoneExists) throw new Error('Phone already registered');

  const hashedPassword = await hashPassword(data.password);

  const user = await userRepository.createUser({
    ...data,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
};

export const login = async (data: any) => {
  const user = await userRepository.findEmailWithPassword(data.email);
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await comparePassword(data.password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await userRepository.updateRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refresh = async (token: string) => {
  const decoded: any = verifyRefreshToken(token);

  const user = await userRepository.findByIdWithRefreshToken(decoded.userId);

  if (!user || user.refreshToken !== token) {
    throw new Error('Invalid refresh token');
  }

  const newAccessToken = generateAccessToken(user.id);

  return { accessToken: newAccessToken };
};

export const logout = async (userId: string) => {
  await userRepository.updateRefreshToken(userId, null);
};

export const forgotPassword = async (email: string) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const resetToken = generateResetToken(user._id.toString());

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

  await userRepository.saveUser(user);

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendResetEmail(user.email, resetUrl);

  return { message: 'Reset link sent', resetToken };
};

export const resetPassword = async (token: string, newPassword: string) => {
  verifyResetToken(token);

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await userRepository.findByResetToken(hashedToken);

  if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new Error('Invalid or expired token');
  }

  user.password = await hashPassword(newPassword);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  user.refreshToken = null;

  user.passwordChangedAt = new Date();

  await userRepository.saveUser(user);

  return { message: 'Password updated successfully' };
};
