const { createError } = require('../utils/errors');

const validateCreateTransaction = (data) => {
  const { items, paymentMode, customerId } = data;

  // Validate required fields
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw createError('VALIDATION_ERROR', 'Transaction must have at least one item', 400);
  }

  if (!paymentMode) {
    throw createError('VALIDATION_ERROR', 'Payment mode is required', 400);
  }

  // Validate payment mode
  const validPaymentModes = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER'];
  if (!validPaymentModes.includes(paymentMode)) {
    throw createError('VALIDATION_ERROR', 'Invalid payment mode', 400);
  }

  // Validate items
  items.forEach((item, index) => {
    if (!item.productId) {
      throw createError('VALIDATION_ERROR', `Item ${index + 1}: Product ID is required`, 400);
    }

    if (!item.quantity || item.quantity <= 0) {
      throw createError('VALIDATION_ERROR', `Item ${index + 1}: Quantity must be greater than 0`, 400);
    }

    if (typeof item.quantity !== 'number' || !Number.isInteger(item.quantity)) {
      throw createError('VALIDATION_ERROR', `Item ${index + 1}: Quantity must be a valid integer`, 400);
    }
  });

  // Validate customer ID if provided
  if (customerId && typeof customerId !== 'string') {
    throw createError('VALIDATION_ERROR', 'Customer ID must be a valid string', 400);
  }

  return {
    items: items.map(item => ({
      productId: item.productId,
      quantity: parseInt(item.quantity)
    })),
    paymentMode,
    customerId: customerId || null
  };
};

const validateTransactionFilters = (filters) => {
  const { 
    startDate, 
    endDate, 
    paymentMode, 
    status, 
    customerId, 
    employeeId,
    page = 1, 
    limit = 10 
  } = filters;

  const validatedFilters = {};

  // Validate dates
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

  // Validate payment mode
  if (paymentMode) {
    const validPaymentModes = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER'];
    if (!validPaymentModes.includes(paymentMode)) {
      throw createError('VALIDATION_ERROR', 'Invalid payment mode', 400);
    }
    validatedFilters.paymentMode = paymentMode;
  }

  // Validate status
  if (status) {
    const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      throw createError('VALIDATION_ERROR', 'Invalid transaction status', 400);
    }
    validatedFilters.status = status;
  }

  // Validate IDs
  if (customerId) {
    validatedFilters.customerId = customerId;
  }

  if (employeeId) {
    validatedFilters.employeeId = employeeId;
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

const validateUpdateTransactionStatus = (data) => {
  const { status } = data;

  if (!status) {
    throw createError('VALIDATION_ERROR', 'Status is required', 400);
  }

  const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
  if (!validStatuses.includes(status)) {
    throw createError('VALIDATION_ERROR', 'Invalid transaction status', 400);
  }

  return { status };
};

module.exports = {
  validateCreateTransaction,
  validateTransactionFilters,
  validateUpdateTransactionStatus
};