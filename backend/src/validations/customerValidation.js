const { createError } = require('../utils/errors');

const validateCreateCustomer = (data) => {
  const { name, email, phone, address } = data;

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw createError('VALIDATION_ERROR', 'Customer name is required', 400);
  }

  if (name.trim().length > 100) {
    throw createError('VALIDATION_ERROR', 'Customer name must be less than 100 characters', 400);
  }

  // Validate optional email
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw createError('VALIDATION_ERROR', 'Invalid email format', 400);
    }
  }

  // Validate optional phone
  if (phone) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      throw createError('VALIDATION_ERROR', 'Invalid phone number format', 400);
    }
  }

  // Validate optional address
  if (address && address.length > 500) {
    throw createError('VALIDATION_ERROR', 'Address must be less than 500 characters', 400);
  }

  return {
    name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    address: address?.trim() || null
  };
};

const validateUpdateCustomer = (data) => {
  const { name, email, phone, address } = data;

  const updateData = {};

  // Validate name if provided
  if (name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw createError('VALIDATION_ERROR', 'Customer name cannot be empty', 400);
    }
    if (name.trim().length > 100) {
      throw createError('VALIDATION_ERROR', 'Customer name must be less than 100 characters', 400);
    }
    updateData.name = name.trim();
  }

  // Validate email if provided
  if (email !== undefined) {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw createError('VALIDATION_ERROR', 'Invalid email format', 400);
      }
      updateData.email = email.trim();
    } else {
      updateData.email = null;
    }
  }

  // Validate phone if provided
  if (phone !== undefined) {
    if (phone) {
      const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
      if (!phoneRegex.test(phone)) {
        throw createError('VALIDATION_ERROR', 'Invalid phone number format', 400);
      }
      updateData.phone = phone.trim();
    } else {
      updateData.phone = null;
    }
  }

  // Validate address if provided
  if (address !== undefined) {
    if (address && address.length > 500) {
      throw createError('VALIDATION_ERROR', 'Address must be less than 500 characters', 400);
    }
    updateData.address = address?.trim() || null;
  }

  return updateData;
};

const validateCustomerFilters = (filters) => {
  const { search, page = 1, limit = 10 } = filters;

  const validatedFilters = {};

  // Validate search
  if (search && typeof search === 'string') {
    validatedFilters.search = search.trim();
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
  validateCreateCustomer,
  validateUpdateCustomer,
  validateCustomerFilters
};