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
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    next(err);
  }
};
