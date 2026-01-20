const prisma = require('../../prisma/db');
const { createError } = require('../utils/errors');
const cloudinaryService = require('./cloudinaryService');

const createProduct = async (productData, imageFiles = []) => {
  try {
    // Upload images to Cloudinary if provided
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadResults = await cloudinaryService.uploadMultipleImages(imageFiles);
      imageUrls = uploadResults.map(result => result.url);
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        ...productData,
        imageUrls
      }
    });

    return product;
  } catch (error) {
    // If database creation fails but images were uploaded, clean up
    if (imageUrls.length > 0) {
      try {
        const publicIds = imageUrls.map(url => {
          const parts = url.split('/');
          const filename = parts[parts.length - 1];
          return `pos-products/${filename.split('.')[0]}`;
        });
        await cloudinaryService.deleteMultipleImages(publicIds);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded images:', cleanupError);
      }
    }
    throw error;
  }
};

const getAllProducts = async (filters = {}) => {
  try {
    const { category, search, page = 1, limit = 10 } = filters;
    
    const where = {};
    
    // Category filter
    if (category) {
      where.category = {
        contains: category,
        mode: 'insensitive'
      };
    }
    
    // Search filter (name or description)
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.product.count({ where })
    ]);

    return {
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw createError('NOT_FOUND', 'Product not found', 404);
    }

    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (productId, updateData, imageFiles = []) => {
  try {
    // Check if product exists
    const existingProduct = await getProductById(productId);

    // Upload new images if provided
    let newImageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadResults = await cloudinaryService.uploadMultipleImages(imageFiles);
      newImageUrls = uploadResults.map(result => result.url);
    }

    // Combine existing and new image URLs
    const imageUrls = [...existingProduct.imageUrls, ...newImageUrls];

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...updateData,
        ...(newImageUrls.length > 0 && { imageUrls })
      }
    });

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    // Check if product exists
    const product = await getProductById(productId);

    // Check if product has transaction history
    const transactionCount = await prisma.transactionItem.count({
      where: { productId }
    });

    if (transactionCount > 0) {
      throw createError('CONSTRAINT_ERROR', 'Cannot delete product with transaction history', 409);
    }

    // Delete images from Cloudinary
    if (product.imageUrls && product.imageUrls.length > 0) {
      try {
        const publicIds = product.imageUrls.map(url => {
          const parts = url.split('/');
          const filename = parts[parts.length - 1];
          return `pos-products/${filename.split('.')[0]}`;
        });
        await cloudinaryService.deleteMultipleImages(publicIds);
      } catch (imageError) {
        console.error('Failed to delete images from Cloudinary:', imageError);
        // Continue with product deletion even if image cleanup fails
      }
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id: productId }
    });

    return { message: 'Product deleted successfully' };
  } catch (error) {
    throw error;
  }
};

const updateInventory = async (productId, quantityChange) => {
  try {
    const product = await getProductById(productId);
    
    const newQuantity = product.quantity + quantityChange;
    
    if (newQuantity < 0) {
      throw createError('INVENTORY_ERROR', 'Insufficient inventory', 400);
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { quantity: newQuantity }
    });

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const getLowStockProducts = async (threshold = 10) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        quantity: {
          lte: threshold
        }
      },
      orderBy: {
        quantity: 'asc'
      }
    });

    return products;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateInventory,
  getLowStockProducts
};