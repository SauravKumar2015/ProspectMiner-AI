import React from 'react'
import { useCredits } from '../../hooks/useCredits'

const CreditBadge = () => {
  const { balance, loading } = useCredits()

  if (loading) {
    return <span className="credits">💰 Loading...</span>
  }

  return (
    <span className="credits">
      💰 {balance} credits
    </span>
  )
}

export default CreditBadge