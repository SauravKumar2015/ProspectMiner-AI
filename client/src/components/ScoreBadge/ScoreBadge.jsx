import React from 'react'
import { getScoreBadgeClass } from '../../utils/scoreColor'

const ScoreBadge = ({ score }) => {
  const badgeClass = getScoreBadgeClass(score)
  
  return (
    <span className={`badge ${badgeClass}`}>
      {score || 'Medium'}
    </span>
  )
}

export default ScoreBadge