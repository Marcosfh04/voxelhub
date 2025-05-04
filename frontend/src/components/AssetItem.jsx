import React from 'react'

function AssetItem({ asset }) {
  const handleClick = () => {
    // Redirigirá a detalle /assets/:id (a implementar después)
    console.log('Ver asset:', asset.title)
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
