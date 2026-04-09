import axios from 'axios'

const API_URL = '/api/scrape'

export const scrapeApi = {
  startScrape: async (query, limit, token) => {
    const response = await axios.post(API_URL, { query, limit }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getJobStatus: async (jobId, token) => {
    const response = await axios.get(`${API_URL}/status/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getJobLeads: async (jobId, token) => {
    const response = await axios.get(`${API_URL}/leads/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}