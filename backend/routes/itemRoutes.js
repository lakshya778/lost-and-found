const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  createItem,
  getItems,
  getItemById,
  updateItemStatus,
  deleteItem,
} = require('../controllers/itemController');

router.post('/', protect, upload.single('image'), createItem);
router.get('/', getItems);
router.get('/:id', getItemById);
router.put('/:id/status', protect, updateItemStatus);
router.delete('/:id', protect, deleteItem);

module.exports = router;