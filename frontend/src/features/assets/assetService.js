import axios from 'axios'

const BASE_URL = 'https://backend-42r2.onrender.com'
const API_URL = `${BASE_URL}/api/assets/`

// Crear nuevo asset
const createAsset = async (assetData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, assetData, config)
  return response.data
}

// Obtener todos los assets
const getAssets = async () => {
  const response = await axios.get(API_URL)
  return response.data
}

// Borrar un asset por id
const deleteAsset = async (assetId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + assetId, config)
  return response.data
}

// Obtener un asset por ID
const getAssetById = async (id) => {
  const response = await fetch(`${API_URL}${id}`)
  if (!response.ok) throw new Error('No se pudo obtener el asset')
  return await response.json()
}

// Comentar un asset
const comentarAsset = async (id, comentario, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const response = await axios.post(`${API_URL}${id}/comment`, comentario, config)
  return response.data
}

// Obtener los assets del usuario
const getUserAssets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(`${API_URL}user`, config)
  return response.data
}

// Actualizar un asset por ID
const updateAsset = async (id, assetData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.put(`${API_URL}${id}`, assetData, config)
  return response.data
}

// Buscar assets
const searchAssets = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return await getAssets()
    }
    const response = await axios.get(`${API_URL}search?q=${encodeURIComponent(query.trim())}`)
    return response.data
  } catch (error) {
    console.error('Error searching assets:', error)
    throw error
  }
}

// Valorar un asset
const rateAsset = async (id, ratingData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  const response = await axios.post(`${API_URL}${id}/rate`, ratingData, config)
  return response.data
}

const assetService = {
  getAssets,
  createAsset,
  deleteAsset,
  getAssetById,
  comentarAsset,
  getUserAssets,
  updateAsset,
  searchAssets,
  rateAsset,
}

export default assetService
