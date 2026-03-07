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

export const findEmailWithPassword = (email: string) => {
  return User.findOne({ email }).select('+password');
};

export const findByIdWithRefreshToken = (id: string) => {
  return User.findById(id).select('+refreshToken');
};

export const findByResetToken = (token: string) => {
  return User.findOne({ resetPasswordToken: token }).select(
    '+resetPasswordToken +resetPasswordExpires +refreshToken',
  );
};

export const saveUser = (user: any) => {
  return user.save();
};
