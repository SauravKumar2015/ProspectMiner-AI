import axios from 'axios'

const API_URL = '/api/auth'

export const authApi = {
  register: async (email, password) => {
    const response = await axios.post(`${API_URL}/register`, { email, password })
    return response.data
  },

  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password })
    return response.data
  },

  getMe: async (token) => {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}