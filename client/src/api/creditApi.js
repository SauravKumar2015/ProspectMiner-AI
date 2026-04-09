import axios from 'axios'

const API_URL = '/api/credits'

export const creditApi = {
  getBalance: async (token) => {
    const response = await axios.get(`${API_URL}/balance`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getUsage: async (token) => {
    const response = await axios.get(`${API_URL}/usage`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}