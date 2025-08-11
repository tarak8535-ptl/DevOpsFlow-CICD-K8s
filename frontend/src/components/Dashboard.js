import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const cards = [
    {
      title: 'InfraGen Studio',
      description: 'Generate multi-cloud infrastructure as code',
      icon: '🏗️',
      path: '/terraform',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      featured: true
    },
    {
      title: 'Deployment Logs',
      description: 'View application deployment logs and status',
      icon: '📋',
      path: '/logs',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Monitoring',
      description: 'Monitor system metrics and performance',
      icon: '📊',
      path: '/monitoring',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  return (
    <div className="dashboard">
      <div className="hero">
        <h1>Welcome to CloudTarkk InfraGen</h1>
        <p>Your complete Infrastructure as Code platform</p>
      </div>
      
      <div className="cards-grid">
        {cards.map((card, index) => (
          <Link key={index} to={card.path} className="card-link">
            <div className={`card ${card.featured ? 'featured' : ''}`} style={{ background: card.gradient }}>
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              {card.featured && <div className="featured-badge">Featured</div>}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 0;
        }

        .hero {
          text-align: center;
          padding: 60px 20px;
          background: white;
          margin-bottom: 40px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }

        .hero h1 {
          font-size: 3rem;
          font-weight: 300;
          color: #2c3e50;
          margin: 0 0 20px 0;
        }

        .hero p {
          font-size: 1.3rem;
          color: #7f8c8d;
          margin: 0;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          padding: 0 40px 60px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card-link {
          text-decoration: none;
          display: block;
        }

        .card {
          padding: 40px 30px;
          border-radius: 20px;
          color: white;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
        }

        .card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .card.featured {
          transform: scale(1.05);
        }

        .card-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .card h3 {
          font-size: 1.8rem;
          font-weight: 600;
          margin: 0 0 15px 0;
        }

        .card p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.5;
        }

        .featured-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255,255,255,0.2);
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          
          .cards-grid {
            padding: 0 20px 40px;
            gap: 20px;
          }
          
          .card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
