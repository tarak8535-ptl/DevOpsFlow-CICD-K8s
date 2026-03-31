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

const sectionStyle = {
  background: '#1a1a2e',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
};

const sectionTitleStyle = {
  color: '#4fc3f7',
  fontSize: '18px',
  marginBottom: '16px',
};

const statRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px solid #222',
};

const statLabelStyle = {
  color: '#888',
  fontSize: '14px',
};

const statValueStyle = {
  color: '#e0e0e0',
  fontSize: '14px',
  fontWeight: 600,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '8px',
};

const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  background: '#16213e',
  color: '#888',
  fontSize: '13px',
  textTransform: 'uppercase',
  borderBottom: '1px solid #333',
};

const tdStyle = {
  padding: '10px 12px',
  color: '#e0e0e0',
  borderBottom: '1px solid #222',
  fontSize: '14px',
};

const errorStyle = {
  color: '#e53935',
  textAlign: 'center',
  marginTop: '40px',
  fontSize: '16px',
};

const healthColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'healthy':
      return '#4caf50';
    case 'unhealthy':
    case 'down':
      return '#e53935';
    case 'degraded':
      return '#fdd835';
    default:
      return '#e0e0e0';
  }
};

function Monitoring() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/monitoring/metrics', authHeader());
        setMetrics(response.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
        setError('Failed to load monitoring metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [navigate]);

  if (loading) return <p style={{ color: '#e0e0e0', textAlign: 'center', marginTop: '40px' }}>Loading...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;
  if (!metrics) return null;

  const cluster = metrics.cluster || {};
  const services = metrics.services
    ? Object.entries(metrics.services).map(([name, info]) => ({ name, ...info }))
    : [];

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Monitoring</h2>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>System Status</h3>
        <div style={statRowStyle}>
          <span style={statLabelStyle}>Uptime</span>
          <span style={statValueStyle}>{metrics.uptime ? `${Math.floor(metrics.uptime)}s` : '--'}</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Cluster Stats</h3>
        <div style={statRowStyle}>
          <span style={statLabelStyle}>Nodes</span>
          <span style={statValueStyle}>{cluster.nodes ?? '--'}</span>
        </div>
        <div style={statRowStyle}>
          <span style={statLabelStyle}>Pods</span>
          <span style={statValueStyle}>{cluster.pods ?? '--'}</span>
        </div>
        <div style={statRowStyle}>
          <span style={statLabelStyle}>CPU</span>
          <span style={statValueStyle}>{cluster.cpuUsage ?? '--'}</span>
        </div>
        <div style={statRowStyle}>
          <span style={statLabelStyle}>Memory</span>
          <span style={statValueStyle}>{cluster.memoryUsage ?? '--'}</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Service Health</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Service</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Latency</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td style={{ ...tdStyle, textAlign: 'center' }} colSpan={3}>No services found.</td>
              </tr>
            ) : (
              services.map((svc, idx) => (
                <tr key={svc.name || idx}>
                  <td style={tdStyle}>{svc.name}</td>
                  <td style={{ ...tdStyle, color: healthColor(svc.status), fontWeight: 600 }}>
                    {svc.status}
                  </td>
                  <td style={tdStyle}>{svc.latency ?? '--'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Monitoring;
