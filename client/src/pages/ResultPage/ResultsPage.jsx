import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useLeads } from '../../hooks/useLeads';
import ProgressBar from '../../../components/ProgressBar/ProgressBar';
import LeadsTable from '../../../components/LeadsTable/LeadsTable';

const ResultsPage = () => {
  const { jobId } = useParams();
  const { token } = useAuth();
  const { leads, setLeads, jobStatus, setJobStatus, currentJob } = useLeads();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) {
      navigate('/');
      return;
    }
    fetchJobStatus();
    const interval = setInterval(fetchJobStatus, 3000);
    return () => clearInterval(interval);
  }, [jobId]);

  const fetchJobStatus = async () => {
    try {
      const response = await axios.get(`/api/scrape/status/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setJobStatus(response.data);

      if (response.data.state === 'completed') {
        fetchLeads();
      } else if (response.data.state === 'failed') {
        setError(response.data.failReason || 'Job failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch job status:', error);
      setError('Failed to fetch job status');
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`/api/scrape/leads/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data.leads);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      setError('Failed to fetch leads');
      setLoading(false);
    }
  };

  if (loading && (!jobStatus || jobStatus.state === 'pending' || jobStatus.state === 'processing')) {
    return <div className="loading">Loading job status...</div>;
  }

  if (error) {
    return (
      <div className="card">
        <h3>Error</h3>
        <p className="error">{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Scraping Results: {currentJob?.query || 'Loading...'}</h2>
      
      {jobStatus && jobStatus.state !== 'completed' && (
        <ProgressBar
          current={jobStatus.progress || 0}
          total={jobStatus.total || 0}
          step={jobStatus.progress < jobStatus.total ? 'scraping' : 'enriching'}
          message={`Processing leads...`}
        />
      )}
      
      {jobStatus && jobStatus.state === 'completed' && (
        <>
          <div className="card">
            <h3>Job Completed!</h3>
            <p>Total leads found: {jobStatus.leadCount || leads.length}</p>
            <p>Completed at: {new Date(jobStatus.completedAt).toLocaleString()}</p>
          </div>
          <LeadsTable leads={leads} />
        </>
      )}
      
      {jobStatus && jobStatus.state === 'failed' && (
        <div className="card">
          <h3>Job Failed</h3>
          <p className="error">{jobStatus.failReason || 'An error occurred'}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;