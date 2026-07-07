const express = require('express');
const router = express.Router();
const { getProductsByCategory, getProduct, addProduct, editProduct, changeProductAvailability } = require('../controllers/productController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
// public routes
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);
// admin routes
router.post('/', verifyToken, authorizeRoles('admin'), addProduct);
router.put('/:id', verifyToken, authorizeRoles('admin'), editProduct);
router.patch('/:id/availability', verifyToken, authorizeRoles('admin'), changeProductAvailability);

module.exports = router;