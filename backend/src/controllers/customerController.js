const customerService = require('../services/customerService');
const { 
  validateCreateCustomer, 
  validateUpdateCustomer,
  validateCustomerFilters 
} = require('../validations/customerValidation');

const createCustomer = async (req, res, next) => {
  try {
    // Validate input
    const validatedData = validateCreateCustomer(req.body);
    
    // Create customer
    const customer = await customerService.createCustomer(validatedData);
    
    res.status(201).json({
      success: true,
      data: customer,
      message: 'Customer created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllCustomers = async (req, res, next) => {
  try {
    // Validate filters
    const filters = validateCustomerFilters(req.query);
    
    const result = await customerService.getAllCustomers(filters);
    
    res.json({
      success: true,
      data: result.customers,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const customer = await customerService.getCustomerById(id);
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = validateUpdateCustomer(req.body);
    
    // Update customer
    const customer = await customerService.updateCustomer(id, validatedData);
    
    res.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await customerService.deleteCustomer(id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerStats = async (req, res, next) => {
  try {
    const stats = await customerService.getCustomerStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
};