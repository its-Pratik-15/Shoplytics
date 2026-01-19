const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let error = {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    path: req.path
  };

  // Prisma errors
  if (err.code === 'P2002') {
    error.code = 'DUPLICATE_ENTRY';
    error.message = 'A record with this information already exists';
  }

  if (err.code === 'P2025') {
    error.code = 'NOT_FOUND';
    error.message = 'Record not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.code = 'INVALID_TOKEN';
    error.message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    error.code = 'TOKEN_EXPIRED';
    error.message = 'Authentication token has expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.code = 'VALIDATION_ERROR';
    error.message = 'Invalid input data';
    error.details = err.details;
  }

  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error
  });
};

module.exports = errorHandler;