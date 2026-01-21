const analyticsService = require('../services/analyticsService');
const { createError } = require('../utils/errors');

const validateDateFilters = (query) => {
  const { startDate, endDate, period, limit } = query;
  
  const filters = {};
  
  // Validate dates
  if (startDate) {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      throw createError('VALIDATION_ERROR', 'Invalid start date format', 400);
    }
    filters.startDate = start;
  }
  
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) {
      throw createError('VALIDATION_ERROR', 'Invalid end date format', 400);
    }
    filters.endDate = end;
  }
  
  // Validate period
  if (period && !['daily', 'monthly'].includes(period)) {
    throw createError('VALIDATION_ERROR', 'Period must be either "daily" or "monthly"', 400);
  }
  if (period) filters.period = period;
  
  // Validate limit
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw createError('VALIDATION_ERROR', 'Limit must be between 1 and 100', 400);
    }
    filters.limit = limitNum;
  }
  
  return filters;
};

const getMostSellingProducts = async (req, res, next) => {
  try {
    const filters = validateDateFilters(req.query);
    
    const products = await analyticsService.getMostSellingProducts(filters);
    
    res.json({
      success: true,
      data: products,
      message: 'Most selling products retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getHighestRevenueProducts = async (req, res, next) => {
  try {
    const filters = validateDateFilters(req.query);
    
    const products = await analyticsService.getHighestRevenueProducts(filters);
    
    res.json({
      success: true,
      data: products,
      message: 'Highest revenue products retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerAnalytics = async (req, res, next) => {
  try {
    const filters = validateDateFilters(req.query);
    
    const analytics = await analyticsService.getCustomerAnalytics(filters);
    
    res.json({
      success: true,
      data: analytics,
      message: 'Customer analytics retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getSalesTrends = async (req, res, next) => {
  try {
    const filters = validateDateFilters(req.query);
    
    const trends = await analyticsService.getSalesTrends(filters);
    
    res.json({
      success: true,
      data: trends,
      message: 'Sales trends retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getFeedbackSpendingInsights = async (req, res, next) => {
  try {
    const filters = validateDateFilters(req.query);
    
    const insights = await analyticsService.getFeedbackSpendingInsights(filters);
    
    res.json({
      success: true,
      data: insights,
      message: 'Feedback spending insights retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardOverview = async (req, res, next) => {
  try {
    const filters = validateDateFilters(req.query);
    
    const overview = await analyticsService.getDashboardOverview(filters);
    
    res.json({
      success: true,
      data: overview,
      message: 'Dashboard overview retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMostSellingProducts,
  getHighestRevenueProducts,
  getCustomerAnalytics,
  getSalesTrends,
  getFeedbackSpendingInsights,
  getDashboardOverview
};