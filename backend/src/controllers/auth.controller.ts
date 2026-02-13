import { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
