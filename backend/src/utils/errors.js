const createError = (code, message, statusCode = 500) => {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
};

const handlePrismaError = (error) => {
  if (error.code === 'P2002') {
    return createError('DUPLICATE_ENTRY', 'A record with this information already exists', 409);
  }
  
  if (error.code === 'P2025') {
    return createError('NOT_FOUND', 'Record not found', 404);
  }
  
  if (error.code === 'P2003') {
    return createError('FOREIGN_KEY_CONSTRAINT', 'Foreign key constraint failed', 400);
  }
  
  return createError('DATABASE_ERROR', 'Database operation failed', 500);
};

module.exports = {
  createError,
  handlePrismaError
};