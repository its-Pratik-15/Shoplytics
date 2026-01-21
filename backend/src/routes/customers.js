const express = require('express');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const customerController = require('../controllers/customerController');

const router = express.Router();

// GET /api/customers/stats - Get customer statistics (Admin/Manager only)
router.get('/stats', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER']), 
  customerController.getCustomerStats
);

// GET /api/customers - Get all customers (All authenticated users)
router.get('/', 
  authenticateToken, 
  customerController.getAllCustomers
);

// GET /api/customers/:id - Get customer by ID (All authenticated users)
router.get('/:id', 
  authenticateToken, 
  customerController.getCustomerById
);

// POST /api/customers - Create new customer (Cashier and above)
router.post('/', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']), 
  customerController.createCustomer
);

// PUT /api/customers/:id - Update customer (Cashier and above)
router.put('/:id', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER', 'CASHIER']), 
  customerController.updateCustomer
);

// DELETE /api/customers/:id - Delete customer (Admin only)
router.delete('/:id', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN']), 
  customerController.deleteCustomer
);

module.exports = router;