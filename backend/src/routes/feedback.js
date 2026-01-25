const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

// GET /api/feedback/stats - Get feedback statistics (Admin/Manager only)
router.get('/stats', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER']), 
  feedbackController.getFeedbackStats
);

// GET /api/feedback/customer/:customerId - Get feedback by customer (All authenticated users)
router.get('/customer/:customerId', 
  authenticateToken, 
  feedbackController.getFeedbackByCustomer
);

// GET /api/feedback - Get all feedback (All authenticated users)
router.get('/', 
  authenticateToken, 
  feedbackController.getAllFeedback
);

// GET /api/feedback/:id - Get feedback by ID (All authenticated users)
router.get('/:id', 
  authenticateToken, 
  feedbackController.getFeedbackById
);

// POST /api/feedback/public - Public feedback submission (no authentication required)
router.post('/public', 
  feedbackController.createPublicFeedback
);

// POST /api/feedback - Create new feedback (Public - customers can leave feedback)
router.post('/', 
  feedbackController.createFeedback
);

// PUT /api/feedback/:id - Update feedback (Customer can update own feedback)
router.put('/:id', 
  feedbackController.updateFeedback
);

// DELETE /api/feedback/:id - Delete feedback (Customer can delete own, Admin can delete any)
router.delete('/:id', 
  authenticateToken,
  feedbackController.deleteFeedback
);

module.exports = router;