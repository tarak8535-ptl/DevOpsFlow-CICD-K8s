import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: '#0f0f23',
};

const formStyle = {
  background: '#1a1a2e',
  padding: '40px',
  borderRadius: '8px',
  width: '360px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const titleStyle = {
  color: '#e0e0e0',
  textAlign: 'center',
  marginBottom: '24px',
  fontSize: '24px',
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  marginBottom: '16px',
  border: '1px solid #333',
  borderRadius: '4px',
  background: '#16213e',
  color: '#e0e0e0',
  fontSize: '14px',
  boxSizing: 'border-box',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: '#4fc3f7',
  color: '#0f0f23',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
};

const errorStyle = {
  color: '#e53935',
  textAlign: 'center',
  marginBottom: '16px',
  fontSize: '14px',
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || 'Login failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h2 style={titleStyle}>DevOps Flow Login</h2>
        {error && <p style={errorStyle}>{error}</p>}
        <input
          style={inputStyle}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={buttonStyle} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
