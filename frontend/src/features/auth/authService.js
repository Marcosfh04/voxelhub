import axios from 'axios'

const API_URL = 'https://backend-42r2.onrender.com/api/users/'

// Registrar usuario
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Iniciar sesión
const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('user')
}

// Actualizar usuario
const updateUser = async (userData, config) => {
  const response = await axios.put(`${API_URL}me`, userData, config)
  return response.data
}

const authService = {
  register,
  logout,
  login,
  updateUser,
}

export default authService
