import crypto from 'crypto';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import * as userRepository from '../repositories/user.repository.js';
import { IUser } from '../models/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
} from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { sendResetEmail } from './email.service.js';
import Seller from '../models/seller.model.js';

import { SignupInput, LoginInput } from '../types/auth.types.js';

export const register = async (data: SignupInput) => {
  if (data.role === 'admin') {
    throw new Error('Admin registration not allowed');
  }

  const emailExists = await userRepository.findByEmail(data.email);
  if (emailExists) throw new Error('Email already registered');

  const phoneExists = await userRepository.findByPhone(data.phone);
  if (phoneExists) throw new Error('Phone already registered');

  const hashedPassword = await hashPassword(data.password);

  const user = await userRepository.createUser({
    ...data,
    password: hashedPassword,
  } as Partial<IUser>);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};
export const login = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await userRepository.findEmailWithPassword(email);
  if (!user) throw new Error('Invalid credentials');

  if (user.status !== 'active') {
    throw new Error('Account is disabled');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const accessToken = generateAccessToken({
    id: (user._id as Types.ObjectId).toString(),
    role: user.role,
  });

  const refreshToken = generateRefreshToken((user._id as Types.ObjectId).toString());

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  await userRepository.updateRefreshToken(user._id.toString(), hashedRefreshToken);

  let redirect = '/';

  if (user.role === 'admin') {
    redirect = '/admin/dashboard';
  } else if (user.role === 'seller') {
    const seller = await Seller.findOne({ userId: user._id });

    if (seller?.isBlocked) {
      throw new Error(`Your  account has been blocked by admin. Reason: ${seller.blockReason}`);
    }

    redirect =
      !seller || !seller.isProfileComplete ? '/seller/complete-profile' : '/seller/dashboard';
  }

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    redirect,
  };
};

export const refresh = async (token: string) => {
  const decoded = verifyRefreshToken(token) as JwtPayload & { userId: string };

  const user = await userRepository.findByIdWithRefreshToken(decoded.userId);

  if (!user) throw new Error('Invalid refresh token');

  const hashedIncoming = crypto.createHash('sha256').update(token).digest('hex');

  if (user.refreshToken !== hashedIncoming) {
    throw new Error('Invalid refresh token');
  }

  const newRefreshToken = generateRefreshToken(user._id.toString());

  const hashedNewRefresh = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

  await userRepository.updateRefreshToken(user._id.toString(), hashedNewRefresh);

  const newAccessToken = generateAccessToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (userId: string) => {
  await userRepository.updateRefreshToken(userId, null);
  return { message: 'Logged out successfully' };
};

export const forgotPassword = async (email: string) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('User not found');

  const resetToken = generateResetToken(user._id.toString());

  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

  await userRepository.saveUser(user);

  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

  await sendResetEmail(user.email, resetUrl);

  return { message: 'Reset link sent' };
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
