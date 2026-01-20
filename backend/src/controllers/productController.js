const productService = require('../services/productService');
const { validateCreateProduct, validateUpdateProduct } = require('../validations/productValidation');

const createProduct = async (req, res, next) => {
  try {
    // Validate input
    const validatedData = validateCreateProduct(req.body);
    
    // Get uploaded files
    const imageFiles = req.files || [];
    
    // Create product
    const product = await productService.createProduct(validatedData, imageFiles);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const filters = {
      category: req.query.category,
      search: req.query.search,
      page: req.query.page || 1,
      limit: req.query.limit || 10
    };
    
    const result = await productService.getAllProducts(filters);
    
    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await productService.getProductById(id);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = validateUpdateProduct(req.body);
    
    // Get uploaded files
    const imageFiles = req.files || [];
    
    // Update product
    const product = await productService.updateProduct(id, validatedData, imageFiles);
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await productService.deleteProduct(id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const getLowStockProducts = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 10;
    
    const products = await productService.getLowStockProducts(parseInt(threshold));
    
    res.json({
      success: true,
      data: products,
      message: `Products with stock below ${threshold}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};