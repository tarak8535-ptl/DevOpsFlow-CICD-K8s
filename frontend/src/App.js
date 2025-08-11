import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DeploymentLogs from './components/DeploymentLogs';
import Monitoring from './components/Monitoring';
import TerraformGenerator from './components/TerraformGenerator';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logs" element={<DeploymentLogs />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/terraform" element={<TerraformGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
