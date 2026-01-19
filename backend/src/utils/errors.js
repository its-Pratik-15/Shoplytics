const createError = (code, message, statusCode = 500) => {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
};

const getErrorDetails = (err) => {
  // Prisma errors
  if (err.code === 'P2002') {
    return {
      code: 'DUPLICATE_ENTRY',
      message: 'A record with this information already exists',
      statusCode: 409
    };
  }

  if (err.code === 'P2025') {
    return {
      code: 'NOT_FOUND',
      message: 'Record not found',
      statusCode: 404
    };
  }

  if (err.code === 'P2003') {
    return {
      code: 'FOREIGN_KEY_CONSTRAINT',
      message: 'Foreign key constraint failed',
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return {
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    return {
      code: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired',
      statusCode: 401
    };
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Invalid input data',
      statusCode: 400,
      details: err.details
    };
  }

  // Default error
  return {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred',
    statusCode: err.status || err.statusCode || 500
  };
};

const formatErrorResponse = (err, path) => {
  const errorDetails = getErrorDetails(err);
  
  return {
    success: false,
    error: {
      code: errorDetails.code,
      message: errorDetails.message,
      ...(errorDetails.details && { details: errorDetails.details }),
      timestamp: new Date().toISOString(),
      path
    }
  };
};

const handlePrismaError = (error) => {
  const errorDetails = getErrorDetails(error);
  return createError(errorDetails.code, errorDetails.message, errorDetails.statusCode);
};

module.exports = {
  createError,
  getErrorDetails,
  formatErrorResponse,
  handlePrismaError
};