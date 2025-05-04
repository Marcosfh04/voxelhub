const express = require('express');
const router = express.Router();
const {
  getAssets,
  createAsset,
  deleteAsset,
  updateAsset,
} = require('../controllers/assetController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getAssets).post(protect, createAsset);
router.route('/:id').put(protect, updateAsset).delete(protect, deleteAsset);

module.exports = router;
