import * as userRepository from '../repositories/user.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

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
  const user = await userRepository.Findemailwithpassword(data.email);
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
