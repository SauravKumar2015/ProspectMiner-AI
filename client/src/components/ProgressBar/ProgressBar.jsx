import React from 'react'

const ProgressBar = ({ current, total, step, message }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="card">
      <h3>Scraping Progress</h3>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}>
          {Math.round(percentage)}%
        </div>
      </div>
      <p><strong>Step:</strong> {step === 'scraping' ? 'Scraping Google Maps' : 'Enriching Data'}</p>
      <p><strong>Progress:</strong> {current} / {total} leads processed</p>
      {message && <p><strong>Status:</strong> {message}</p>}
    </div>
  )
}

export default ProgressBar