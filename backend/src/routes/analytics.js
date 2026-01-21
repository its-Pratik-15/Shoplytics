const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// All analytics routes require authentication and admin/manager role
const analyticsAuth = [
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER'])
];

// GET /api/analytics/dashboard - Get comprehensive dashboard overview
router.get('/dashboard', 
  ...analyticsAuth,
  analyticsController.getDashboardOverview
);

// GET /api/analytics/products/top-selling - Get most selling products by quantity
router.get('/products/top-selling', 
  ...analyticsAuth,
  analyticsController.getMostSellingProducts
);

// GET /api/analytics/products/top-revenue - Get highest revenue products
router.get('/products/top-revenue', 
  ...analyticsAuth,
  analyticsController.getHighestRevenueProducts
);

// GET /api/analytics/customers - Get customer analytics
router.get('/customers', 
  ...analyticsAuth,
  analyticsController.getCustomerAnalytics
);

// GET /api/analytics/sales/trends - Get sales trends (daily/monthly)
router.get('/sales/trends', 
  ...analyticsAuth,
  analyticsController.getSalesTrends
);

// GET /api/analytics/feedback/insights - Get feedback vs spending insights
router.get('/feedback/insights', 
  ...analyticsAuth,
  analyticsController.getFeedbackSpendingInsights
);

module.exports = router;