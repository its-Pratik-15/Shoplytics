const { createError } = require('../utils/errors');

const validateCreateFeedback = (data) => {
  const { rating, comment, customerId } = data;

  // Validate required fields
  if (!rating) {
    throw createError('VALIDATION_ERROR', 'Rating is required', 400);
  }

  if (!customerId) {
    throw createError('VALIDATION_ERROR', 'Customer ID is required', 400);
  }

  // Validate rating
  const ratingNum = parseInt(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw createError('VALIDATION_ERROR', 'Rating must be between 1 and 5', 400);
  }

  // Validate comment (optional)
  if (comment && typeof comment !== 'string') {
    throw createError('VALIDATION_ERROR', 'Comment must be a string', 400);
  }

  if (comment && comment.length > 1000) {
    throw createError('VALIDATION_ERROR', 'Comment must be less than 1000 characters', 400);
  }

  // Validate customer ID
  if (typeof customerId !== 'string') {
    throw createError('VALIDATION_ERROR', 'Customer ID must be a valid string', 400);
  }

  return {
    rating: ratingNum,
    comment: comment?.trim() || null,
    customerId
  };
};

const validateUpdateFeedback = (data) => {
  const { rating, comment } = data;

  const updateData = {};

  // Validate rating if provided
  if (rating !== undefined) {
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw createError('VALIDATION_ERROR', 'Rating must be between 1 and 5', 400);
    }
    updateData.rating = ratingNum;
  }

  // Validate comment if provided
  if (comment !== undefined) {
    if (comment && typeof comment !== 'string') {
      throw createError('VALIDATION_ERROR', 'Comment must be a string', 400);
    }
    if (comment && comment.length > 1000) {
      throw createError('VALIDATION_ERROR', 'Comment must be less than 1000 characters', 400);
    }
    updateData.comment = comment?.trim() || null;
  }

  return updateData;
};

const validateFeedbackFilters = (filters) => {
  const { rating, customerId, startDate, endDate, page = 1, limit = 10 } = filters;

  const validatedFilters = {};

  // Validate rating filter
  if (rating) {
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw createError('VALIDATION_ERROR', 'Rating filter must be between 1 and 5', 400);
    }
    validatedFilters.rating = ratingNum;
  }

  // Validate customer ID filter
  if (customerId) {
    validatedFilters.customerId = customerId;
  }

  // Validate date filters
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw createError('VALIDATION_ERROR', 'Invalid start date format', 400);
    }
    validatedFilters.startDate = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      throw createError('VALIDATION_ERROR', 'Invalid end date format', 400);
    }
    validatedFilters.endDate = end;
  }

  // Validate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  if (isNaN(pageNum) || pageNum < 1) {
    throw createError('VALIDATION_ERROR', 'Page must be a positive integer', 400);
  }

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw createError('VALIDATION_ERROR', 'Limit must be between 1 and 100', 400);
  }

  validatedFilters.page = pageNum;
  validatedFilters.limit = limitNum;

  return validatedFilters;
};

module.exports = {
  validateCreateFeedback,
  validateUpdateFeedback,
  validateFeedbackFilters
};