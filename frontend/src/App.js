import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DeploymentLogs from './components/DeploymentLogs';
import Monitoring from './components/Monitoring';

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#1a1a2e',
  padding: '12px 24px',
};

const navLinksStyle = {
  display: 'flex',
  gap: '20px',
};

const linkStyle = {
  color: '#e0e0e0',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
};

const activeLinkStyle = {
  ...linkStyle,
  color: '#4fc3f7',
  borderBottom: '2px solid #4fc3f7',
  paddingBottom: '2px',
};

const logoutBtnStyle = {
  background: '#e53935',
  color: '#fff',
  border: 'none',
  padding: '8px 18px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
};

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getLinkStyle = (path) =>
    location.pathname === path ? activeLinkStyle : linkStyle;

  return (
    <nav style={navStyle}>
      <div style={navLinksStyle}>
        <Link to="/dashboard" style={getLinkStyle('/dashboard')}>Dashboard</Link>
        <Link to="/logs" style={getLinkStyle('/logs')}>Logs</Link>
        <Link to="/monitoring" style={getLinkStyle('/monitoring')}>Monitoring</Link>
      </div>
      <button style={logoutBtnStyle} onClick={handleLogout}>Logout</button>
    </nav>
  );
}

function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div>
      {!isLoginPage && <NavBar />}
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logs" element={<DeploymentLogs />} />
          <Route path="/monitoring" element={<Monitoring />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
