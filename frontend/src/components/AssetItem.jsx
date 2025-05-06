import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/AssetItem.css'


function AssetItem({ asset }) {
  console.log('Asset recibido:', asset)
  console.log('🖼️ previewImage:', asset.previewImage)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/assets/${asset._id}`)
  }
  const extraerIdGoogle = (url) => {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/)
    return match ? match[1] : ''
  }

  return (

    <div className='asset-card' onClick={handleClick}>
      <img
        src={`https://lh3.googleusercontent.com/d/${extraerIdGoogle(asset.previewImage)}=s220`}
        alt={asset.title}
        className="asset-image"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = 'https://placehold.co/150x150?text=No+Image'
        }}
      />

      <div className='asset-info'>
        <h3>{asset.title}</h3>
        <p>{asset.type}</p>

      </div>

    </div>
  )
}

export default AssetItem
