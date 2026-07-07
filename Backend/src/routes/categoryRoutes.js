const express = require('express');
const router = express.Router();
const { getAllCategories, getCategory, addCategory, editCategory,deleteCategory} = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
// public routes
router.get('/', getAllcategories);
router.get('/:id', getCategory);
// admin routers
router.post('/', verifyToken, authorizeRoles('admin'), addCategory);
router.put('/:id', verifyToken, authorizeRoles('admin'), editCategory);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteCategory);
module.exports = router;
