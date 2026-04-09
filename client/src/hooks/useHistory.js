import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export const useHistory = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobs(response.data.jobs)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history')
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`/api/history/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchHistory()
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return { jobs, loading, error, fetchHistory, deleteJob }
}