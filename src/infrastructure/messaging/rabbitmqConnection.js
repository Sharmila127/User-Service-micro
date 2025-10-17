import amqp from 'amqplib';
import pino from 'pino';
const logger = pino();
let connection = null;
let channel = null;
export const connectRabbitMQ = async (url) => {
  connection = await amqp.connect(url);
  channel = await connection.createChannel();
  logger.info('✅ RabbitMQ connected (User)');
  return { connection, channel };
};
export const publish = async (queue, message) => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};
export const consume = async (queue, handler) => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const payload = JSON.parse(msg.content.toString());
        await handler(payload);
        channel.ack(msg);
      } catch (err) {
        logger.error({ err }, 'Failed to handle message');
        channel.ack(msg);
      }
    }
  });
};
