import React from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';

const HomePage = () => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Welcome to ProspectMiner AI</h1>
        <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
          Enter a search query to find and enrich leads from Google Maps
        </p>
      </div>
      <SearchBar />
      <div style={{ marginTop: '40px' }}>
        <h3>Example Searches:</h3>
        <ul style={{ marginTop: '10px', color: '#666' }}>
          <li>Dentists in Chicago</li>
          <li>Real Estate Agents in New York</li>
          <li>Restaurants in Los Angeles</li>
          <li>Lawyers in Houston</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;