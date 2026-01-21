const feedbackService = require('../services/feedbackService');
const { 
  validateCreateFeedback, 
  validateUpdateFeedback,
  validateFeedbackFilters 
} = require('../validations/feedbackValidation');

const createFeedback = async (req, res, next) => {
  try {
    // Validate input
    const validatedData = validateCreateFeedback(req.body);
    
    // Create feedback
    const feedback = await feedbackService.createFeedback(validatedData);
    
    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Feedback created successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getAllFeedback = async (req, res, next) => {
  try {
    // Validate filters
    const filters = validateFeedbackFilters(req.query);
    
    const result = await feedbackService.getAllFeedback(filters);
    
    res.json({
      success: true,
      data: result.feedback,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const feedback = await feedbackService.getFeedbackById(id);
    
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

const updateFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerId } = req.body; // Customer ID from request body for ownership verification
    
    // Validate input
    const validatedData = validateUpdateFeedback(req.body);
    
    // Update feedback
    const feedback = await feedbackService.updateFeedback(id, validatedData, customerId);
    
    res.json({
      success: true,
      data: feedback,
      message: 'Feedback updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerId } = req.body; // Customer ID for ownership verification
    
    // Check if user is admin
    const isAdmin = ['OWNER', 'ADMIN'].includes(req.user?.role);
    
    const result = await feedbackService.deleteFeedback(id, customerId, isAdmin);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackStats = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate) : undefined
    };
    
    const stats = await feedbackService.getFeedbackStats(filters);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackByCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    
    const feedback = await feedbackService.getFeedbackByCustomer(customerId);
    
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  getFeedbackByCustomer
};