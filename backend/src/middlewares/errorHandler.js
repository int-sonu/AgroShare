import logger from './utils/logger.js';

const errorHandler = (err, req, res) => {
  logger.error(err.message, { stack: err.stack });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
