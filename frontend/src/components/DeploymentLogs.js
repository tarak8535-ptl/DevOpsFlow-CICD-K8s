import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

const pageStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
};

const titleStyle = {
  color: '#e0e0e0',
  marginBottom: '24px',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#1a1a2e',
  borderRadius: '8px',
  overflow: 'hidden',
};

const thStyle = {
  textAlign: 'left',
  padding: '14px 16px',
  background: '#16213e',
  color: '#888',
  fontSize: '13px',
  textTransform: 'uppercase',
  borderBottom: '1px solid #333',
};

const tdStyle = {
  padding: '12px 16px',
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

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'success':
      return '#4caf50';
    case 'failed':
      return '#e53935';
    case 'rolling':
      return '#fdd835';
    default:
      return '#e0e0e0';
  }
};

function DeploymentLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('/api/logs', authHeader());
        setLogs(response.data);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
        setError('Failed to load deployment logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [navigate]);

  if (loading) return <p style={{ color: '#e0e0e0', textAlign: 'center', marginTop: '40px' }}>Loading...</p>;
  if (error) return <p style={errorStyle}>{error}</p>;

  return (
    <div style={pageStyle}>
      <h2 style={titleStyle}>Deployment Logs</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Service</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td style={{ ...tdStyle, textAlign: 'center' }} colSpan={5}>No logs found.</td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id}>
                <td style={tdStyle}>{log.id}</td>
                <td style={tdStyle}>{log.type}</td>
                <td style={tdStyle}>{log.service}</td>
                <td style={{ ...tdStyle, color: statusColor(log.status), fontWeight: 600 }}>
                  {log.status}
                </td>
                <td style={tdStyle}>{log.timestamp}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DeploymentLogs;
