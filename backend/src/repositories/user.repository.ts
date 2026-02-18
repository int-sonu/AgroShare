import { User } from '../models/user.model.js';

export const findByEmail = (email: string) => {
  return User.findOne({ email });
};

export const findByPhone = (phone: string) => {
  return User.findOne({ phone });
};

export const createUser = (data: any) => {
  return User.create(data);
};

export const updateRefreshToken = (userId: string, token: string | null) => {
  return User.findByIdAndUpdate(userId, {
    refreshToken: token,
  });
};

export const Findemailwithpassword = (email: string) => {
  return User.findOne({ email }).select('+password');
};

export const findById = (id: string) => {
  return User.findById(id);
};

export const findByIdWithRefreshToken = (id: string) => {
  return User.findById(id).select('+refreshToken');
};
