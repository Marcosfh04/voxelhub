const asyncHandler = require('express-async-handler')
const Asset = require('../models/assetModel')

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
const getAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find()
  res.status(200).json(assets)
})

// @desc    Create asset
// @route   POST /api/assets
// @access  Private
const createAsset = asyncHandler(async (req, res) => {
  const { title, description, type, previewImage, assetUrl } = req.body

  if (!title || !description || !type || !previewImage || !assetUrl) {
    res.status(400)
    throw new Error('Please fill in all fields')
  }

  const asset = await Asset.create({
    user: req.user.id,
    title,
    description,
    type,
    previewImage,
    assetUrl,
  })

  res.status(201).json(asset)
})

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private
const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id)

  if (!asset) {
    res.status(404)
    throw new Error('Asset not found')
  }

  if (asset.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  await asset.deleteOne()

  res.status(200).json({ id: req.params.id })
})

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private
const updateAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findById(req.params.id)

  if (!asset) {
    res.status(404)
    throw new Error('Asset not found')
  }

  if (asset.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Not authorized')
  }

  const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updated)
})

module.exports = {
  getAssets,
  createAsset,
  deleteAsset,
  updateAsset,
}
