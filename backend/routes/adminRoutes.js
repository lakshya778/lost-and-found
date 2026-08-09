const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const { getAllUsers, getStats } = require('../controllers/adminController');

router.get('/users', protect, isAdmin, getAllUsers);
router.get('/stats', protect, isAdmin, getStats);

module.exports = router;