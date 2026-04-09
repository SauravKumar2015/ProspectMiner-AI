import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLeads } from '../../hooks/useLeads';

const HistoryPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const { setCurrentJob, setLeads } = useLeads();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data.jobs);
    } catch (error) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeads = async (job) => {
    try {
      const response = await axios.get(`/api/scrape/leads/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(response.data.leads);
      setCurrentJob({ jobId: job._id, query: job.query, limit: job.limit });
      navigate(`/results/${job._id}`);
    } catch (error) {
      setError('Failed to load leads');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job and all its leads?')) return;

    try {
      await axios.delete(`/api/history/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchHistory();
    } catch (error) {
      setError('Failed to delete job');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge badge-high">Completed</span>;
      case 'processing': return <span className="badge badge-medium">Processing</span>;
      case 'failed': return <span className="badge badge-low">Failed</span>;
      default: return <span className="badge">Pending</span>;
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div>
      <h2>Search History</h2>
      {error && <div className="error">{error}</div>}
      
      {jobs.length === 0 ? (
        <div className="card">
          <p>No searches yet. Start by searching for leads on the home page.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">Start Searching</button>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Leads Found</th>
                  <th>Credits Used</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.query}</td>
                    <td>{job.leadCount || 0}</td>
                    <td>{job.creditsSpent || 0}</td>
                    <td>{getStatusBadge(job.status)}</td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      {job.status === 'completed' && (
                        <button onClick={() => handleViewLeads(job)} className="btn btn-primary" style={{ marginRight: '10px', padding: '5px 10px', fontSize: '12px' }}>View</button>
                      )}
                      <button onClick={() => handleDeleteJob(job._id)} className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '12px' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;