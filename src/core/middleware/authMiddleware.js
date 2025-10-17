import axios from 'axios';
import AppError from '../errors/AppError.js';

const AUTH_VALIDATE_PATH = (url) => `${url.replace(/\/$/, '')}/auth/validate`;

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token missing', 401);
    }
    const token = authHeader.split(' ')[1];
    const authUrl = process.env.AUTH_SERVICE_URL;
    if (!authUrl) throw new AppError('AUTH_SERVICE_URL not configured', 500);
    const resp = await axios.post(AUTH_VALIDATE_PATH(authUrl), { token }, { timeout: 5000 });
    const returned = resp.data && (resp.data.data || resp.data.user || resp.data);
    if (!returned || !returned.user) {
      const user = resp.data.user || resp.data.data || resp.data;
      if (!user) throw new AppError('Invalid token payload from Auth Service', 401);
      req.user = user.user || user;
    } else {
      req.user = returned.user;
    }
    next();
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return next(new AppError('Invalid or expired token', 401));
    }
    if (err.isAxiosError) {
      return next(new AppError('Failed to validate token with Auth Service', 502));
    }
    next(err);
  }
};
