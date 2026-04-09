import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export const useCredits = () => {
  const [balance, setBalance] = useState(0)
  const [usage, setUsage] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, user, setUser } = useAuth()

  const fetchBalance = async () => {
    try {
      const response = await axios.get('/api/credits/balance', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBalance(response.data.credits)
      if (setUser && user) {
        setUser({ ...user, credits: response.data.credits })
      }
    } catch (err) {
      setError(err.response?.data?.message)
    }
  }

  const fetchUsage = async () => {
    try {
      const response = await axios.get('/api/credits/usage', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsage(response.data.usage)
    } catch (err) {
      setError(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchBalance()
      fetchUsage()
    }
  }, [token])

  return { balance, usage, loading, error, fetchBalance, fetchUsage }
}