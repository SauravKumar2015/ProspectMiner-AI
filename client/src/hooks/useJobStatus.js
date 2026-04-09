import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export const useJobStatus = (jobId) => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchStatus = async () => {
    if (!jobId) return
    
    try {
      const response = await axios.get(`/api/scrape/status/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStatus(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch job status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [jobId])

  return { status, loading, error, refetch: fetchStatus }
}