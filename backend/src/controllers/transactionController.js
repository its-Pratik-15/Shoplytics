const transactionService = require('../services/transactionService');
const { 
  validateCreateTransaction, 
  validateTransactionFilters,
  validateUpdateTransactionStatus 
} = require('../validations/transactionValidation');

const createTransaction = async (req, res, next) => {
  try {
    // Validate input
    const validatedData = validateCreateTransaction(req.body);
    
    // Get user/employee info from auth middleware
    const userId = req.user?.type === 'user' ? req.user.id : null;
    const employeeId = req.user?.type === 'employee' ? req.user.id : null;
    
    // Create transaction
    const transaction = await transactionService.createTransaction(
      validatedData, 
      userId, 
      employeeId
    );
    
    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    // Validate filters
    const filters = validateTransactionFilters(req.query);
    
    const result = await transactionService.getAllTransactions(filters);
    
    res.json({
      success: true,
      data: result.transactions,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const transaction = await transactionService.getTransactionById(id);
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

const updateTransactionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = validateUpdateTransactionStatus(req.body);
    
    // Update transaction status
    const transaction = await transactionService.updateTransactionStatus(id, validatedData);
    
    res.json({
      success: true,
      data: transaction,
      message: 'Transaction status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionStats = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined
    };
    
    const stats = await transactionService.getTransactionStats(filters);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus,
  getTransactionStats
};