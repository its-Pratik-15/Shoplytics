const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// GET /api/transactions/stats - Get transaction statistics (Admin/Manager only)
router.get('/stats', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER']), 
  transactionController.getTransactionStats
);

// GET /api/transactions - Get all transactions (All authenticated users)
router.get('/', 
  authenticateToken, 
  transactionController.getAllTransactions
);

// GET /api/transactions/:id - Get transaction by ID (All authenticated users)
router.get('/:id', 
  authenticateToken, 
  transactionController.getTransactionById
);

// POST /api/transactions - Create new transaction (Cashier and above)
router.post('/', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']), 
  transactionController.createTransaction
);

// PUT /api/transactions/:id/status - Update transaction status (Admin/Manager only)
router.put('/:id/status', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER']), 
  transactionController.updateTransactionStatus
);

module.exports = router;