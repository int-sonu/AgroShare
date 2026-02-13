import { User } from '../models/user.model.js';
import { IUser } from '../models/user.model.js';

export const findByEmail = async (email: string) => {
  return User.findOne({ email });
};

export const findByPhone = async (phone: string) => {
  return User.findOne({ phone });
};

export const createUser = async (data: Partial<IUser>) => {
  return User.create(data);
};

export const updateRefreshToken = async (userId: string, token: string | null) => {
  return User.findByIdAndUpdate(userId, {
    refreshToken: token,
  });
};
