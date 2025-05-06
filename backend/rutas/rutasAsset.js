const express = require('express');
const router = express.Router();
const {
  getAssets,
  createAsset,
  deleteAsset,
  updateAsset,
  getAssetById,
  comentarAsset,
  getUserAssets,
} = require('../controllers/assetController');

const { protect } = require('../middleware/authMiddleware');
  
router.get('/user', protect, getUserAssets); 
router.get('/:id', getAssetById)
router.route('/').get(getAssets).post(protect, createAsset);
router.route('/:id').put(protect, updateAsset).delete(protect, deleteAsset);
router.post('/:id/comment', protect, comentarAsset)



module.exports = router;
