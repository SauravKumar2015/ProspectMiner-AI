import React from 'react'
import { exportToCSV } from '../../utils/exportCsv'

const ExportButton = ({ leads, filename, buttonText = 'Export to CSV', className = 'btn btn-primary' }) => {
  const handleExport = () => {
    if (!leads || leads.length === 0) {
      alert('No leads to export')
      return
    }
    exportToCSV(leads, filename)
  }

  return (
    <button onClick={handleExport} className={className}>
      {buttonText}
    </button>
  )
}

export default ExportButton