export const exportToCSV = (leads, filename = 'leads.csv') => {
  if (!leads || leads.length === 0) {
    console.warn('No leads to export')
    return
  }

  const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Score', 'Services', 'Email Pattern', 'Owner']
  
  const csvData = leads.map(lead => [
    `"${(lead.name || '').replace(/"/g, '""')}"`,
    `"${(lead.address || '').replace(/"/g, '""')}"`,
    `"${(lead.phone || '').replace(/"/g, '""')}"`,
    `"${(lead.website || '').replace(/"/g, '""')}"`,
    `"${(lead.rating || '').replace(/"/g, '""')}"`,
    `"${(lead.score || 'Medium').replace(/"/g, '""')}"`,
    `"${((lead.services || []).join('; ')).replace(/"/g, '""')}"`,
    `"${(lead.emailPattern || '').replace(/"/g, '""')}"`,
    `"${(lead.ownerName || '').replace(/"/g, '""')}"`
  ])

  const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}