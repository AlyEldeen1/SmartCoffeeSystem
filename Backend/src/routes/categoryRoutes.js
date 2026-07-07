const express = require('express');
const router = express.Router();
const { getCategories, getCategory, addCategory, editCategory, removeCategory } = require('../controllers/categoryController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
// public routes
router.get('/', getCategories);
router.get('/:id', getCategory);
// admin routers
router.post('/', verifyToken, authorizeRoles('admin'), addCategory);
router.put('/:id', verifyToken, authorizeRoles('admin'), editCategory);
router.delete('/:id', verifyToken, authorizeRoles('admin'), removeCategory);
module.exports = router;
