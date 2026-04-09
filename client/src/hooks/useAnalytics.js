import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/analytics/summary', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAnalytics(response.data.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  return { analytics, loading, error, fetchAnalytics }
}