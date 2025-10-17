import UserService from '../services/user.service.js';
import { successResponse } from '../../core/utils/response.utils.js';
const userService = new UserService();

export const register = async (req, res, next) => {
  try {
    const dto = req.body;
    const created = await userService.register(dto);
    return successResponse(res, created, 201);
  } catch (err) {
    next(err);
  }
};

export const profile = async (req, res, next) => {
  try {
    const userId = req.user?.id || (req.user && req.user.user && req.user.user.id);
    if (!userId) return res.status(400).json({ success: false, message: 'User id missing in token' });
    const profile = await userService.getProfile(userId);
    return successResponse(res, profile, 200);
  } catch (err) {
    next(err);
  }
};
