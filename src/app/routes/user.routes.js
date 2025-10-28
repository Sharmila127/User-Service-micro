import express from 'express';
import { register, profile } from '../controllers/user.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';
import { registerSchema } from '../validations/user.validation.js';
import AppError from '../../core/errors/AppError.js';

const router = express.Router();

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return next(new AppError(error.details.map(d => d.message).join(', '), 400));
  next();
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', authMiddleware, profile);

export default router;
