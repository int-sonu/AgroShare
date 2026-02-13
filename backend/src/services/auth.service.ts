import { SignupInput } from '../types/auth.types.js';
import * as userRepository from '../repositories/user.repository.js';
import { hashPassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const signup = async (data: SignupInput) => {
  const existingEmail = await userRepository.findByEmail(data.email);
  if (existingEmail) {
    throw new Error('Email already registered');
  }

  const existingPhone = await userRepository.findByPhone(data.phone);
  if (existingPhone) {
    throw new Error('Phone already registered');
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await userRepository.createUser({
    ...data,
    password: hashedPassword,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await userRepository.updateRefreshToken(user.id, refreshToken);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
