const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

//admin route
router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: ' WELCOME ADMIN '});
});
// staff route
router.get( '/staff',verifyToken, authorizeRoles('admin', 'cashier'), (req, res) => {
    res.json({ message: 'Welcome Staff 💼' });
});
// profile route
router.get( '/profile', verifyToken,(req, res) => {
    res.json({ message: 'User profile', user: req.user });
});
// public routes
router.post('/register', register);
router.post('/login', login);
module.exports = router;