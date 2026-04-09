import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export const useLeads = () => {
  const [currentJob, setCurrentJob] = useState(null);
  const [leads, setLeads] = useState([]);
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchLeads = async (jobId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/scrape/leads/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data.leads);
      return response.data.leads;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leads');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (leadsData, filename = 'leads.csv') => {
    if (!leadsData || leadsData.length === 0) return;
    
    const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Score', 'Services', 'Email Pattern', 'Owner'];
    const csvData = leadsData.map(lead => [
      `"${(lead.name || '').replace(/"/g, '""')}"`,
      `"${(lead.address || '').replace(/"/g, '""')}"`,
      `"${(lead.phone || '').replace(/"/g, '""')}"`,
      `"${(lead.website || '').replace(/"/g, '""')}"`,
      `"${(lead.rating || '').replace(/"/g, '""')}"`,
      `"${(lead.score || 'Medium').replace(/"/g, '""')}"`,
      `"${((lead.services || []).join('; ')).replace(/"/g, '""')}"`,
      `"${(lead.emailPattern || '').replace(/"/g, '""')}"`,
      `"${(lead.ownerName || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    currentJob,
    setCurrentJob,
    leads,
    setLeads,
    jobStatus,
    setJobStatus,
    loading,
    error,
    fetchLeads,
    exportToCSV
  };
};
