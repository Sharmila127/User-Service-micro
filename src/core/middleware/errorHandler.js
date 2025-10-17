import pino from 'pino';
const logger = pino();

export default function errorHandler(err, req, res, next) {
  logger.error({ err }, 'Unhandled error');
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
}
