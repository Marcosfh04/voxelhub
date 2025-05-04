import React from 'react'
import { useNavigate } from 'react-router-dom'

function AssetItem({ asset }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/assets/${asset._id}`)
  }

  return (
    <div className='asset-card' onClick={handleClick}>
      <img src={asset.previewImage} alt={asset.title} className='asset-image' />
      <div className='asset-info'>
        <h3>{asset.title}</h3>
        <p>{asset.type}</p>
      </div>
    </div>
  )
}

export default AssetItem
