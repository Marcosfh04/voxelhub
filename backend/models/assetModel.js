const mongoose = require('mongoose')

const assetSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    type: {
      type: String,
      required: [true, 'Please specify the asset type'],
      enum: ['2D', '3D', 'audio', 'video', 'code', 'other'],
    },
    previewImage: {
      type: String, // URL a Google Drive o similar
      required: true,
    },
    assetUrl: {
      type: String, // Enlace de descarga
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Asset', assetSchema)
