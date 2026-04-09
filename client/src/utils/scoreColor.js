export const getScoreColor = (score) => {
  switch (score?.toLowerCase()) {
    case 'high':
      return { bg: '#28a745', text: 'white', label: 'High' }
    case 'medium':
      return { bg: '#ffc107', text: '#333', label: 'Medium' }
    case 'low':
      return { bg: '#dc3545', text: 'white', label: 'Low' }
    default:
      return { bg: '#6c757d', text: 'white', label: 'Unknown' }
  }
}

export const getScoreBadgeClass = (score) => {
  switch (score?.toLowerCase()) {
    case 'high': return 'badge-high'
    case 'medium': return 'badge-medium'
    case 'low': return 'badge-low'
    default: return 'badge-medium'
  }
}