import React, { createContext, useState, useContext } from 'react';

const LeadsContext = createContext(null);

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within LeadsProvider');
  }
  return context;
};

export const LeadsProvider = ({ children }) => {
  const [currentJob, setCurrentJob] = useState(null);
  const [leads, setLeads] = useState([]);
  const [jobStatus, setJobStatus] = useState(null);

  const value = {
    currentJob,
    setCurrentJob,
    leads,
    setLeads,
    jobStatus,
    setJobStatus
  };

  return (
    <LeadsContext.Provider value={value}>
      {children}
    </LeadsContext.Provider>
  );
};
