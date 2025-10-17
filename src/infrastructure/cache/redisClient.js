import { createClient } from 'redis';
import pino from 'pino';
const logger = pino();
let client;
export const connectRedis = async (url) => {
  client = createClient({ url });
  client.on('error', (err) => logger.error({ err }, 'Redis error'));
  client.on('connect', () => logger.info('✅ Redis connecting...'));
  await client.connect();
  logger.info('✅ Redis connected (User)');
  return client;
};
export const getRedisClient = () => {
  if (!client) throw new Error('Redis client not initialized');
  return client;
};
