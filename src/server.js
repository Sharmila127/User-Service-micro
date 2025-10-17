import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './infrastructure/database/mongoose.js';
import { connectRedis } from './infrastructure/cache/redisClient.js';
import { connectRabbitMQ, consume } from './infrastructure/messaging/rabbitmqConnection.js';
import UserService from './app/services/user.service.js';
import pino from 'pino';

const logger = pino();
const PORT = process.env.PORT || 4100;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await connectRedis(process.env.REDIS_URL);
    await connectRabbitMQ(process.env.RABBITMQ_URL);

    const userService = new UserService();

    // consume auth events
    await consume('auth.login', async (payload) => {
      logger.info({ payload }, 'Received auth.login');
      try { await userService.handleAuthLoginEvent(payload); } catch (e) { logger.error({ e }, 'handleAuthLoginEvent failed'); }
    });
    await consume('auth.logout', async (payload) => {
      logger.info({ payload }, 'Received auth.logout');
      try { await userService.handleAuthLogoutEvent(payload); } catch (e) { logger.error({ e }, 'handleAuthLogoutEvent failed'); }
    });

    app.listen(PORT, () => logger.info(`✅ User Service running on ${PORT}`));
  } catch (err) {
    logger.error({ err }, 'Failed to start User Service');
    process.exit(1);
  }
};

start();
