import bcrypt from 'bcryptjs';
import UserRepository from '../../domain/repositories/user.repository.js';
import AppError from '../../core/errors/AppError.js';
import UserCreatedEvent from '../../domain/events/UserCreatedEvent.js';
import { publish } from '../../infrastructure/messaging/rabbitmqConnection.js';
import { getRedisClient } from '../../infrastructure/cache/redisClient.js';

const USER_CACHE_TTL = parseInt(process.env.USER_CACHE_TTL || '300', 10);

export default class UserService {
  constructor() {
    this.userRepo = new UserRepository();
    try { this.redis = getRedisClient(); } catch (e) { this.redis = null; }
  }

  async register({ name, email, password }) {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new AppError('Email already registered', 400);
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userRepo.create({ name, email, password: hashed });
    if (this.redis) {
      await this.redis.set(`user:${user._id}`, JSON.stringify({
        id: user._id, name: user.name, email: user.email, role: user.role
      }), { EX: USER_CACHE_TTL });
    }
    const event = new UserCreatedEvent({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt.toISOString()
    });
    await publish('user.events', event);
    return { id: user._id, name: user.name, email: user.email };
  }

  async getProfile(userId) {
    try {
      if (this.redis) {
        const cached = await this.redis.get(`user:${userId}`);
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    const profile = { id: user._id, name: user.name, email: user.email, role: user.role };
    try {
      if (this.redis) await this.redis.set(`user:${userId}`, JSON.stringify(profile), { EX: USER_CACHE_TTL });
    } catch (e) {}
    return profile;
  }

  async handleAuthLoginEvent({ userId, email }) {
    const event = { type: 'user.logged_in', payload: { userId, email, at: new Date().toISOString() } };
    await publish('user.events', event);
  }

  async handleAuthLogoutEvent({ userId }) {
    const event = { type: 'user.logged_out', payload: { userId, at: new Date().toISOString() } };
    await publish('user.events', event);
  }
}
