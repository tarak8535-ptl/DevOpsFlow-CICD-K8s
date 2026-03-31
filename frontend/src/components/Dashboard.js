import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const pageStyle = {
  maxWidth: '1000px',
  margin: '0 auto',
};

const titleStyle = {
  color: '#e0e0e0',
  marginBottom: '24px',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  background: '#1a1a2e',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
};

const cardLabelStyle = {
  color: '#888',
  fontSize: '13px',
  textTransform: 'uppercase',
  marginBottom: '8px',
};

const cardValueStyle = {
  color: '#e0e0e0',
  fontSize: '28px',
  fontWeight: 700,
};

const errorStyle = {
  color: '#e53935',
  textAlign: 'center',
  marginTop: '40px',
  fontSize: '16px',
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/dashboard', authHeader());
        setStats(response.data.stats);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p style={{ color: '#e0e0e0', textAlign: 'center', marginTop: '40px' }}>Loading...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Deployments', value: stats.deployments },
    { label: 'Active Services', value: stats.activeServices },
    { label: 'Healthy Pods', value: stats.healthyPods },
    { label: 'CPU Usage', value: stats.cpuUsage },
    { label: 'Memory Usage', value: stats.memoryUsage },
    { label: 'Last Deployment', value: stats.lastDeployment },
  ];

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Dashboard</h2>
      <div style={gridStyle}>
        {cards.map((card) => (
          <div key={card.label} style={cardStyle}>
            <div style={cardLabelStyle}>{card.label}</div>
            <div style={cardValueStyle}>{card.value ?? '--'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
