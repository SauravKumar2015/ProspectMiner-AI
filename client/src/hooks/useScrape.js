import { useState } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export const useScrape = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const startScrape = async (query, limit) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post('/api/scrape', 
        { query, limit },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return { success: true, jobId: response.data.jobId }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start scraping')
      return { success: false, error: err.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }

  return { startScrape, loading, error }
}