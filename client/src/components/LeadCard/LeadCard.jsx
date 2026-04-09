import React, { useState } from 'react'
import ScoreBadge from '../ScoreBadge/ScoreBadge'

const LeadCard = ({ lead }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card" style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h4>{lead.name}</h4>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>
            {lead.address}
          </p>
        </div>
        <ScoreBadge score={lead.score} />
      </div>
      
      <div style={{ marginTop: '10px' }}>
        {lead.phone && <p><strong>Phone:</strong> {lead.phone}</p>}
        {lead.website && lead.website !== '#' && (
          <p><strong>Website:</strong> <a href={lead.website} target="_blank" rel="noopener noreferrer">{lead.website}</a></p>
        )}
        {lead.rating && <p><strong>Rating:</strong> ⭐ {lead.rating}</p>}
      </div>
      
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{ marginTop: '10px', background: 'none', border: 'none', color: '#667eea', cursor: 'pointer' }}
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
      
      {expanded && (
        <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
          {lead.services && lead.services.length > 0 && (
            <p><strong>Services:</strong> {lead.services.join(', ')}</p>
          )}
          {lead.emailPattern && <p><strong>Email Pattern:</strong> {lead.emailPattern}</p>}
          {lead.ownerName && <p><strong>Owner:</strong> {lead.ownerName}</p>}
        </div>
      )}
    </div>
  )
}

export default LeadCard