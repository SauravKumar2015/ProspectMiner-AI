import axios from 'axios'

const API_URL = '/api/analytics'

export const analyticsApi = {
  getSummary: async (token) => {
    const response = await axios.get(`${API_URL}/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}