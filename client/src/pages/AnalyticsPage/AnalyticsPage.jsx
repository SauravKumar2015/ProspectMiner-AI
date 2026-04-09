import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data.data);
    } catch (error) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (error) return <div className="card error">{error}</div>;
  if (!analytics || analytics.totalJobs === 0) {
    return (
      <div className="card">
        <h2>Analytics</h2>
        <p>No data available yet. Complete some lead generation jobs to see analytics.</p>
      </div>
    );
  }

  const maxScore = Math.max(analytics.scoreDistribution.High, analytics.scoreDistribution.Medium, analytics.scoreDistribution.Low);
  const getBarWidth = (value) => (value / maxScore) * 100;

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      
      <div className="card">
        <h3>Summary Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <strong>Total Jobs</strong>
            <p style={{ fontSize: '24px', color: '#667eea' }}>{analytics.totalJobs}</p>
          </div>
          <div>
            <strong>Total Leads</strong>
            <p style={{ fontSize: '24px', color: '#667eea' }}>{analytics.totalLeads}</p>
          </div>
          <div>
            <strong>Credits Used</strong>
            <p style={{ fontSize: '24px', color: '#667eea' }}>{analytics.creditsUsed}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Lead Score Distribution</h3>
        <div>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>High Quality Leads</span>
              <span>{analytics.scoreDistribution.High}</span>
            </div>
            <div style={{ background: '#e9ecef', height: '30px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${getBarWidth(analytics.scoreDistribution.High)}%`, background: '#28a745', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {Math.round((analytics.scoreDistribution.High / analytics.totalLeads) * 100)}%
              </div>
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Medium Quality Leads</span>
              <span>{analytics.scoreDistribution.Medium}</span>
            </div>
            <div style={{ background: '#e9ecef', height: '30px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${getBarWidth(analytics.scoreDistribution.Medium)}%`, background: '#ffc107', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                {Math.round((analytics.scoreDistribution.Medium / analytics.totalLeads) * 100)}%
              </div>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Low Quality Leads</span>
              <span>{analytics.scoreDistribution.Low}</span>
            </div>
            <div style={{ background: '#e9ecef', height: '30px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${getBarWidth(analytics.scoreDistribution.Low)}%`, background: '#dc3545', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                {Math.round((analytics.scoreDistribution.Low / analytics.totalLeads) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;