import React from 'react'

const LeadsTable = ({ leads }) => {
  const getScoreBadgeClass = (score) => {
    switch(score?.toLowerCase()) {
      case 'high': return 'badge-high'
      case 'medium': return 'badge-medium'
      case 'low': return 'badge-low'
      default: return 'badge-medium'
    }
  }

  const exportToCSV = () => {
    const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Score', 'Services', 'Email Pattern', 'Owner']
    const csvData = leads.map(lead => [
      lead.name,
      lead.address || '',
      lead.phone || '',
      lead.website || '',
      lead.rating || '',
      lead.score || '',
      (lead.services || []).join('; '),
      lead.emailPattern || '',
      lead.ownerName || ''
    ])
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${new Date().toISOString()}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!leads || leads.length === 0) {
    return <div className="card">No leads found yet. Please wait for the scraping to complete.</div>
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>Leads Found ({leads.length})</h3>
        <button onClick={exportToCSV} className="btn btn-primary">
          Export to CSV
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Rating</th>
              <th>Score</th>
              <th>Services</th>
              <th>Email Pattern</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={index}>
                <td>{lead.name}</td>
                <td>{lead.address}</td>
                <td>{lead.phone}</td>
                <td>
                  {lead.website && lead.website !== '#' && (
                    <a href={lead.website} target="_blank" rel="noopener noreferrer">
                      Visit
                    </a>
                  )}
                </td>
                <td>{lead.rating}</td>
                <td>
                  <span className={`badge ${getScoreBadgeClass(lead.score)}`}>
                    {lead.score || 'Medium'}
                  </span>
                </td>
                <td>{(lead.services || []).slice(0, 3).join(', ')}</td>
                <td>{lead.emailPattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LeadsTable