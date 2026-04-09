import axios from 'axios'

const API_URL = '/api/history'

export const historyApi = {
  getHistory: async (token) => {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  deleteJob: async (jobId, token) => {
    const response = await axios.delete(`${API_URL}/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}