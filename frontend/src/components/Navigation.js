import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  if (location.pathname === '/') return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/terraform', label: 'InfraGen Studio', icon: '🏗️' },
    { path: '/logs', label: 'Logs', icon: '📋' },
    { path: '/monitoring', label: 'Monitoring', icon: '📊' }
  ];

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="brand-icon">☁️</span>
        CloudTarkk InfraGen
      </div>
      
      <div className="nav-items">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
      
      <button onClick={logout} className="logout-btn">
        🚪 Logout
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .navigation {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-brand {
          color: white;
          font-weight: 700;
          font-size: 1.4rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-icon {
          font-size: 1.8rem;
        }

        .nav-items {
          display: flex;
          gap: 5px;
        }

        .nav-item {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          padding: 12px 20px;
          border-radius: 25px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1);
          color: white;
          transform: translateY(-2px);
        }

        .nav-item.active {
          background: rgba(255,255,255,0.2);
          color: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .logout-btn {
          background: rgba(220, 53, 69, 0.9);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logout-btn:hover {
          background: #dc3545;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
        }

        @media (max-width: 768px) {
          .navigation {
            padding: 10px 15px;
            flex-wrap: wrap;
            gap: 10px;
          }
          
          .nav-brand {
            font-size: 1.2rem;
          }
          
          .nav-items {
            order: 3;
            width: 100%;
            justify-content: center;
            margin-top: 10px;
          }
          
          .nav-item {
            padding: 8px 15px;
            font-size: 0.9rem;
          }
        }
      `}} />
    </nav>
  );
};

export default Navigation;