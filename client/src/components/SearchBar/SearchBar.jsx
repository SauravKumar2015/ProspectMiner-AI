import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLeads } from '../../hooks/useLeads';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();
  const { setCurrentJob } = useLeads();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    if (limit < 1 || limit > 500) {
      setError('Limit must be between 1 and 500');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/scrape', 
        { query: query.trim(), limit },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { jobId } = response.data;
      setCurrentJob({ jobId, query, limit });
      navigate(`/results/${jobId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to start scraping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Find Leads</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Search Query</label>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., Dentists in Chicago, Lawyers in New York" disabled={loading} />
        </div>
        <div className="form-group">
          <label>Number of Leads (1-500)</label>
          <input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} min="1" max="500" disabled={loading} />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Starting...' : 'Find Leads'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;