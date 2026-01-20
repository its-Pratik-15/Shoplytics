const cloudinary = require('cloudinary').v2;
const { createError } = require('../utils/errors');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file, folder = 'pos-products') => {
  try {
    if (!file) {
      throw createError('VALIDATION_ERROR', 'No image file provided', 400);
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    };
  } catch (error) {
    if (error.code) {
      throw error; // Re-throw our custom errors
    }
    throw createError('UPLOAD_ERROR', 'Failed to upload image to Cloudinary', 500);
  }
};

const uploadMultipleImages = async (files, folder = 'pos-products') => {
  try {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    return results;
  } catch (error) {
    throw error;
  }
};

const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw createError('VALIDATION_ERROR', 'Public ID is required for image deletion', 400);
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      throw createError('DELETE_ERROR', 'Failed to delete image from Cloudinary', 500);
    }

    return result;
  } catch (error) {
    if (error.code) {
      throw error; // Re-throw our custom errors
    }
    throw createError('DELETE_ERROR', 'Failed to delete image from Cloudinary', 500);
  }
};

const deleteMultipleImages = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) {
      return [];
    }

    const deletePromises = publicIds.map(publicId => deleteImage(publicId));
    const results = await Promise.all(deletePromises);
    
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages
};