const { formatErrorResponse, getErrorDetails } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  const errorResponse = formatErrorResponse(err, req.path);
  const errorDetails = getErrorDetails(err);
  
  res.status(errorDetails.statusCode).json(errorResponse);
};

module.exports = errorHandler;