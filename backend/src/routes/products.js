const express = require('express');
const multer = require('multer');
const { authenticateToken, requireRole } = require('../middlewares/auth');
const productController = require('../controllers/productController');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/products - Get all products (public)
router.get('/', productController.getAllProducts);

// GET /api/products/low-stock - Get low stock products (Admin/Manager only)
router.get('/low-stock', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN', 'MANAGER']), 
  productController.getLowStockProducts
);

// GET /api/products/:id - Get product by ID (public)
router.get('/:id', productController.getProductById);

// POST /api/products - Create product (Admin only)
router.post('/', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN']), 
  upload.array('images', 5),
  productController.createProduct
);

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN']), 
  upload.array('images', 5),
  productController.updateProduct
);

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', 
  authenticateToken, 
  requireRole(['OWNER', 'ADMIN']), 
  productController.deleteProduct
);

module.exports = router;