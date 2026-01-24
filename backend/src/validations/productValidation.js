const { createError } = require('../utils/errors');

const validateCreateProduct = (data) => {
  const { name, description, sellingPrice, costPrice, quantity, category, sku } = data;

  // Name validation
  if (!name) {
    throw createError('VALIDATION_ERROR', 'Product name is required', 400);
  }
  if (name.length < 2) {
    throw createError('VALIDATION_ERROR', 'Product name must be at least 2 characters long', 400);
  }
  if (name.length > 100) {
    throw createError('VALIDATION_ERROR', 'Product name cannot exceed 100 characters', 400);
  }

  // Selling Price validation
  if (sellingPrice === undefined || sellingPrice === null) {
    throw createError('VALIDATION_ERROR', 'Product selling price is required', 400);
  }
  if (isNaN(sellingPrice) || parseFloat(sellingPrice) < 0) {
    throw createError('VALIDATION_ERROR', 'Product selling price must be a valid positive number', 400);
  }

  // Cost Price validation
  if (costPrice === undefined || costPrice === null) {
    throw createError('VALIDATION_ERROR', 'Product cost price is required', 400);
  }
  if (isNaN(costPrice) || parseFloat(costPrice) < 0) {
    throw createError('VALIDATION_ERROR', 'Product cost price must be a valid positive number', 400);
  }

  // Business rule: Cost price should be less than selling price
  if (parseFloat(costPrice) >= parseFloat(sellingPrice)) {
    throw createError('VALIDATION_ERROR', 'Cost price must be less than selling price', 400);
  }

  // Quantity validation
  if (quantity === undefined || quantity === null) {
    throw createError('VALIDATION_ERROR', 'Product quantity is required', 400);
  }
  if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
    throw createError('VALIDATION_ERROR', 'Product quantity must be a valid non-negative integer', 400);
  }

  // Description validation (optional)
  if (description && description.length > 500) {
    throw createError('VALIDATION_ERROR', 'Product description cannot exceed 500 characters', 400);
  }

  // Category validation (optional)
  if (category && category.length > 50) {
    throw createError('VALIDATION_ERROR', 'Product category cannot exceed 50 characters', 400);
  }

  // SKU validation (optional)
  if (sku && sku.length > 50) {
    throw createError('VALIDATION_ERROR', 'Product SKU cannot exceed 50 characters', 400);
  }

  return {
    name: name.trim(),
    description: description ? description.trim() : null,
    sellingPrice: parseFloat(sellingPrice),
    costPrice: parseFloat(costPrice),
    quantity: parseInt(quantity),
    category: category ? category.trim() : null,
    sku: sku ? sku.trim() : null
  };
};

const validateUpdateProduct = (data) => {
  const { name, description, sellingPrice, costPrice, quantity, category, sku } = data;

  const updates = {};

  // Name validation (optional for update)
  if (name !== undefined) {
    if (!name) {
      throw createError('VALIDATION_ERROR', 'Product name cannot be empty', 400);
    }
    if (name.length < 2) {
      throw createError('VALIDATION_ERROR', 'Product name must be at least 2 characters long', 400);
    }
    if (name.length > 100) {
      throw createError('VALIDATION_ERROR', 'Product name cannot exceed 100 characters', 400);
    }
    updates.name = name.trim();
  }

  // Selling Price validation (optional for update)
  if (sellingPrice !== undefined) {
    if (isNaN(sellingPrice) || parseFloat(sellingPrice) < 0) {
      throw createError('VALIDATION_ERROR', 'Product selling price must be a valid positive number', 400);
    }
    updates.sellingPrice = parseFloat(sellingPrice);
  }

  // Cost Price validation (optional for update)
  if (costPrice !== undefined) {
    if (isNaN(costPrice) || parseFloat(costPrice) < 0) {
      throw createError('VALIDATION_ERROR', 'Product cost price must be a valid positive number', 400);
    }
    updates.costPrice = parseFloat(costPrice);
  }

  // Business rule: Cost price should be less than selling price (if both are being updated)
  if (updates.sellingPrice !== undefined && updates.costPrice !== undefined) {
    if (updates.costPrice >= updates.sellingPrice) {
      throw createError('VALIDATION_ERROR', 'Cost price must be less than selling price', 400);
    }
  }

  // Quantity validation (optional for update)
  if (quantity !== undefined) {
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
      throw createError('VALIDATION_ERROR', 'Product quantity must be a valid non-negative integer', 400);
    }
    updates.quantity = parseInt(quantity);
  }

  // Description validation (optional)
  if (description !== undefined) {
    if (description && description.length > 500) {
      throw createError('VALIDATION_ERROR', 'Product description cannot exceed 500 characters', 400);
    }
    updates.description = description ? description.trim() : null;
  }

  // Category validation (optional)
  if (category !== undefined) {
    if (category && category.length > 50) {
      throw createError('VALIDATION_ERROR', 'Product category cannot exceed 50 characters', 400);
    }
    updates.category = category ? category.trim() : null;
  }

  // SKU validation (optional)
  if (sku !== undefined) {
    if (sku && sku.length > 50) {
      throw createError('VALIDATION_ERROR', 'Product SKU cannot exceed 50 characters', 400);
    }
    updates.sku = sku ? sku.trim() : null;
  }

  return updates;
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct
};