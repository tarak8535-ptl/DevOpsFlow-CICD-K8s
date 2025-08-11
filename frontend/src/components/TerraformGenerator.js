import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const TerraformGenerator = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [generatedTerraform, setGeneratedTerraform] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState({ region: 'us-east-1', profile: '' });
  const [activeStep, setActiveStep] = useState(1);
  const [regions, setRegions] = useState([]);
  const [instanceTypes, setInstanceTypes] = useState([]);
  const [customConfig, setCustomConfig] = useState({
    tags: { Environment: 'dev', Project: 'InfraGen', Owner: 'CloudTarkk' },
    security: { encryption: 'true', backup_retention: '7', multi_az: 'false' },
    monitoring: { cloudwatch: 'basic', log_retention: '14', xray: 'false' }
  });

  useEffect(() => {
    fetchServices();
    fetchRegions();
    fetchInstanceTypes();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching services with token:', token);
      const response = await api.get('/terraform/services');
      console.log('Services response:', response.data);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error.response?.data || error.message);
      // Set default services if API fails
      setServices([
        { id: 'ec2', name: 'EC2 Instance', category: 'Compute' },
        { id: 'rds', name: 'RDS Database', category: 'Database' },
        { id: 's3', name: 'S3 Bucket', category: 'Storage' },
        { id: 'vpc', name: 'VPC Network', category: 'Networking' },
        { id: 'lambda', name: 'Lambda Function', category: 'Compute' },
        { id: 'iam_role', name: 'IAM Role', category: 'Security' },
        { id: 'iam_policy', name: 'IAM Policy', category: 'Security' },
        { id: 'iam_user', name: 'IAM User', category: 'Security' },
        { id: 'iam_group', name: 'IAM Group', category: 'Security' },
        { id: 'cloudwatch', name: 'CloudWatch', category: 'Monitoring' },
        { id: 'elb', name: 'Load Balancer', category: 'Networking' }
      ]);
    }
  };

  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/terraform/regions');
      setRegions(response.data.regions || []);
    } catch (error) {
      console.error('Error fetching regions:', error);
      setRegions([
        { code: 'us-east-1', name: 'US East (N. Virginia)', flag: '🇺🇸' },
        { code: 'us-west-2', name: 'US West (Oregon)', flag: '🇺🇸' },
        { code: 'eu-west-1', name: 'Europe (Ireland)', flag: '🇮🇪' }
      ]);
    }
  };

  const fetchInstanceTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/terraform/instance-types');
      setInstanceTypes(response.data.instanceTypes || []);
    } catch (error) {
      console.error('Error fetching instance types:', error);
      setInstanceTypes([
        { type: 't3.micro', vcpu: 2, memory: '1 GiB', price: '$0.0104/hour' },
        { type: 't3.small', vcpu: 2, memory: '2 GiB', price: '$0.0208/hour' }
      ]);
    }
  };

  const getServiceIcon = (serviceType) => {
    const icons = {
      ec2: '🖥️',
      rds: '🗄️',
      s3: '🪣',
      vpc: '🌐',
      lambda: '⚡',
      iam_role: '🔐',
      iam_policy: '📜',
      iam_user: '👤',
      iam_group: '👥',
      cloudwatch: '📊',
      elb: '⚖️'
    };
    return icons[serviceType] || '☁️';
  };

  const addService = (serviceType) => {
    const newService = {
      id: Date.now(),
      type: serviceType,
      name: `${serviceType}_${selectedServices.length + 1}`,
      config: {}
    };
    setSelectedServices([...selectedServices, newService]);
    fetchTemplate(serviceType, newService.id);
  };

  const fetchTemplate = async (serviceType, serviceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/terraform/templates/${serviceType}`);
      
      setSelectedServices(prev => 
        prev.map(service => 
          service.id === serviceId 
            ? { ...service, config: response.data.template }
            : service
        )
      );
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  const updateServiceConfig = (serviceId, field, value) => {
    setSelectedServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, config: { ...service.config, [field]: value } }
          : service
      )
    );
  };

  const removeService = (serviceId) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const generateTerraform = async () => {
    if (selectedServices.length === 0) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        services: selectedServices.map(({ id, ...service }) => service),
        provider,
        customConfig
      };
      
      const response = await api.post('/terraform/generate', payload);
      
      setGeneratedTerraform(response.data.terraform);
    } catch (error) {
      console.error('Error generating Terraform:', error.response?.data || error.message);
      alert('Failed to generate Terraform code. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTerraform = () => {
    const blob = new Blob([generatedTerraform], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.tf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFieldOptions = (serviceType, fieldName) => {
    const options = {
      ec2: {
        instance_type: instanceTypes.map(t => ({ value: t.type, label: `${t.type} - ${t.vcpu} vCPU, ${t.memory} (${t.price})` })),
        tenancy: [{ value: 'default', label: 'Default' }, { value: 'dedicated', label: 'Dedicated' }],
        'root_block_device.volume_type': [{ value: 'gp3', label: 'GP3' }, { value: 'gp2', label: 'GP2' }, { value: 'io1', label: 'IO1' }]
      },
      rds: {
        engine: [{ value: 'mysql', label: 'MySQL' }, { value: 'postgres', label: 'PostgreSQL' }, { value: 'mariadb', label: 'MariaDB' }],
        instance_class: [{ value: 'db.t3.micro', label: 'db.t3.micro (1 vCPU, 1 GB)' }, { value: 'db.t3.small', label: 'db.t3.small (2 vCPU, 2 GB)' }],
        storage_type: [{ value: 'gp3', label: 'GP3' }, { value: 'gp2', label: 'GP2' }]
      },
      lambda: {
        runtime: [{ value: 'nodejs18.x', label: 'Node.js 18.x' }, { value: 'python3.11', label: 'Python 3.11' }],
        architectures: [{ value: 'x86_64', label: 'x86_64' }, { value: 'arm64', label: 'ARM64' }]
      },
      elb: {
        load_balancer_type: [{ value: 'application', label: 'Application LB' }, { value: 'network', label: 'Network LB' }],
        scheme: [{ value: 'internet-facing', label: 'Internet-facing' }, { value: 'internal', label: 'Internal' }]
      }
    };
    return options[serviceType]?.[fieldName] || [];
  };

  const renderConfigField = (serviceType, fieldName, value, onChange) => {
    const options = getFieldOptions(serviceType, fieldName);
    
    if (options.length > 0) {
      return (
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }
    
    if (typeof value === 'boolean') {
      return (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    }
    
    if (typeof value === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <textarea
          value={JSON.stringify(value, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value));
            } catch {}
          }}
          rows={4}
        />
      );
    }
    
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };

  const renderServiceConfig = (service) => {
    const serviceInfo = services.find(s => s.id === service.type);
    
    return (
      <div key={service.id} className="service-config">
        <div className="service-header">
          <h4>{getServiceIcon(service.type)} {serviceInfo?.name} - {service.name}</h4>
          <button onClick={() => removeService(service.id)} className="remove-btn">×</button>
        </div>
        
        <div className="config-fields">
          <div className="config-field">
            <label>Resource Name</label>
            <input
              type="text"
              value={service.name}
              onChange={(e) => setSelectedServices(prev =>
                prev.map(s => s.id === service.id ? { ...s, name: e.target.value } : s)
              )}
            />
          </div>
          
          {Object.entries(service.config).map(([key, value]) => (
            <div key={key} className="config-field">
              <label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
              {renderConfigField(service.type, key, value, (newValue) => updateServiceConfig(service.id, key, newValue))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const steps = [
    { number: 1, title: 'Provider', icon: '🌍' },
    { number: 2, title: 'Services', icon: '☁️' },
    { number: 3, title: 'Configure', icon: '⚙️' },
    { number: 4, title: 'Custom', icon: '📝' },
    { number: 5, title: 'Generate', icon: '🚀' }
  ];

  return (
    <div className="terraform-generator">
      <div className="header">
        <h1>InfraGen Studio</h1>
        <p>Design and generate your cloud infrastructure</p>
      </div>

      <div className="steps-nav">
        {steps.map(step => (
          <div 
            key={step.number}
            className={`step ${activeStep >= step.number ? 'active' : ''}`}
            onClick={() => setActiveStep(step.number)}
          >
            <div className="step-icon">{step.icon}</div>
            <span>{step.title}</span>
          </div>
        ))}
      </div>

      <div className="content">
        {activeStep === 1 && (
          <div className="step-content">
            <h2>🌍 AWS Provider Configuration</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>AWS Region</label>
                <select 
                  value={provider.region}
                  onChange={(e) => setProvider({ ...provider, region: e.target.value })}
                >
                  {regions.map(region => (
                    <option key={region.code} value={region.code}>
                      {region.flag} {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>AWS Profile (Optional)</label>
                <input
                  type="text"
                  placeholder="default"
                  value={provider.profile}
                  onChange={(e) => setProvider({ ...provider, profile: e.target.value })}
                />
              </div>
            </div>
            <button className="next-btn" onClick={() => setActiveStep(2)}>Next Step</button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="step-content">
            <h2>☁️ Select AWS Services</h2>
            
            {selectedServices.length > 0 && (
              <div className="selected-summary">
                <h3>Selected Services ({selectedServices.length})</h3>
                <div className="selected-chips">
                  {selectedServices.map(service => {
                    const serviceInfo = services.find(s => s.id === service.type);
                    return (
                      <div key={service.id} className="service-chip">
                        <span>{getServiceIcon(service.type)} {serviceInfo?.name}</span>
                        <button onClick={() => removeService(service.id)}>×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="services-grid">
              {services.length === 0 ? (
                <div className="loading-message">
                  <p>Loading services...</p>
                </div>
              ) : (
                services.map(service => {
                  const isSelected = selectedServices.some(s => s.type === service.id);
                  return (
                    <div 
                      key={service.id} 
                      className={`service-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isSelected && addService(service.id)}
                    >
                      <div className="service-icon">{getServiceIcon(service.id)}</div>
                      <h3>{service.name}</h3>
                      <p>{service.category}</p>
                      {isSelected && <div className="selected-badge">✓</div>}
                    </div>
                  );
                })
              )}
            </div>
            <div className="step-actions">
              <button className="prev-btn" onClick={() => setActiveStep(1)}>Previous</button>
              <button className="next-btn" onClick={() => setActiveStep(3)} disabled={selectedServices.length === 0}>Next Step</button>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="step-content">
            <h2>⚙️ Configure Services</h2>
            <div className="services-config">
              {selectedServices.map(renderServiceConfig)}
            </div>
            <div className="step-actions">
              <button className="prev-btn" onClick={() => setActiveStep(2)}>Previous</button>
              <button className="next-btn" onClick={() => setActiveStep(4)}>Next Step</button>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="step-content">
            <h2>⚙️ Advanced Configuration</h2>
            
            <div className="config-sections">
              <div className="config-section">
                <h3>🏷️ Common Tags</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Environment</label>
                    <select 
                      value={customConfig.tags?.Environment || 'dev'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        tags: { ...customConfig.tags, Environment: e.target.value }
                      })}
                    >
                      <option value="dev">Development</option>
                      <option value="staging">Staging</option>
                      <option value="prod">Production</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={customConfig.tags?.Project || 'InfraGen'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        tags: { ...customConfig.tags, Project: e.target.value }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Owner</label>
                    <input
                      type="text"
                      value={customConfig.tags?.Owner || 'CloudTarkk'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        tags: { ...customConfig.tags, Owner: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h3>🔒 Security Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Enable Encryption</label>
                    <select 
                      value={customConfig.security?.encryption || 'true'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        security: { ...customConfig.security, encryption: e.target.value }
                      })}
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Backup Retention (days)</label>
                    <select 
                      value={customConfig.security?.backup_retention || '7'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        security: { ...customConfig.security, backup_retention: e.target.value }
                      })}
                    >
                      <option value="1">1 day</option>
                      <option value="7">7 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Multi-AZ Deployment</label>
                    <select 
                      value={customConfig.security?.multi_az || 'false'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        security: { ...customConfig.security, multi_az: e.target.value }
                      })}
                    >
                      <option value="false">Single AZ</option>
                      <option value="true">Multi AZ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h3>📊 Monitoring & Logging</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>CloudWatch Monitoring</label>
                    <select 
                      value={customConfig.monitoring?.cloudwatch || 'basic'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        monitoring: { ...customConfig.monitoring, cloudwatch: e.target.value }
                      })}
                    >
                      <option value="basic">Basic</option>
                      <option value="detailed">Detailed</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Log Retention (days)</label>
                    <select 
                      value={customConfig.monitoring?.log_retention || '14'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        monitoring: { ...customConfig.monitoring, log_retention: e.target.value }
                      })}
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Enable X-Ray Tracing</label>
                    <select 
                      value={customConfig.monitoring?.xray || 'false'}
                      onChange={(e) => setCustomConfig({
                        ...customConfig,
                        monitoring: { ...customConfig.monitoring, xray: e.target.value }
                      })}
                    >
                      <option value="false">Disabled</option>
                      <option value="true">Enabled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="step-actions">
              <button className="prev-btn" onClick={() => setActiveStep(3)}>Previous</button>
              <button className="next-btn" onClick={() => setActiveStep(5)}>Generate Code</button>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="step-content">
            <h2>🚀 Generate Infrastructure Code</h2>
            
            <div className="summary-section">
              <h3>Configuration Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Provider:</strong> AWS ({provider.region})
                </div>
                <div className="summary-item">
                  <strong>Services:</strong> {selectedServices.length} selected
                </div>
              </div>
            </div>
            
            <div className="generate-section">
              <button 
                onClick={generateTerraform} 
                disabled={loading || selectedServices.length === 0}
                className="generate-btn"
              >
                {loading ? '⏳ Generating Code...' : '🚀 Generate Terraform Code'}
              </button>
            </div>
            
            {generatedTerraform && (
              <div className="code-output">
                <div className="output-header">
                  <h3>📜 Generated Terraform Configuration</h3>
                  <div className="output-actions">
                    <button onClick={downloadTerraform} className="download-btn">
                      📥 Download main.tf
                    </button>
                    <button onClick={() => navigator.clipboard.writeText(generatedTerraform)} className="copy-btn">
                      📋 Copy Code
                    </button>
                  </div>
                </div>
                <div className="code-container">
                  <pre className="code-block">{generatedTerraform}</pre>
                </div>
                <div className="code-info">
                  <p>📊 Lines: {generatedTerraform.split('\n').length} | Characters: {generatedTerraform.length}</p>
                </div>
              </div>
            )}
            
            <div className="step-actions">
              <button className="prev-btn" onClick={() => setActiveStep(4)}>Previous</button>
              {generatedTerraform && (
                <button className="next-btn" onClick={() => setActiveStep(1)}>Start Over</button>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .terraform-generator {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .header {
          text-align: center;
          padding: 60px 20px 40px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header h1 {
          font-size: 3rem;
          font-weight: 300;
          color: #2c3e50;
          margin: 0 0 15px 0;
        }

        .header p {
          font-size: 1.3rem;
          color: #7f8c8d;
          margin: 0;
        }

        .steps-nav {
          display: flex;
          justify-content: center;
          padding: 30px 20px;
          background: white;
          border-bottom: 1px solid #eee;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px 30px;
          margin: 0 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.5;
        }

        .step.active {
          opacity: 1;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-5px);
        }

        .step-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .step-content {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .step-content h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin: 0 0 30px 0;
          text-align: center;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .form-group input, .form-group select {
          padding: 15px;
          border: 2px solid #e0e6ed;
          border-radius: 10px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .service-card {
          padding: 30px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .service-card h3 {
          font-size: 1.2rem;
          margin: 0 0 10px 0;
        }

        .service-card p {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
        }

        .services-config {
          display: grid;
          gap: 30px;
          margin-bottom: 40px;
        }

        .service-config {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 25px;
          border: 2px solid #e0e6ed;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .service-header h4 {
          color: #2c3e50;
          font-size: 1.3rem;
          margin: 0;
        }

        .remove-btn {
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;
          font-size: 1.2rem;
        }

        .config-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .config-field {
          display: flex;
          flex-direction: column;
        }

        .config-field label {
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 8px;
          text-transform: capitalize;
        }

        .config-field input, .config-field textarea {
          padding: 12px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 1rem;
        }

        .config-field textarea {
          min-height: 100px;
          font-family: monospace;
          resize: vertical;
        }

        .config-field select {
          padding: 12px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
        }

        .config-field input[type="number"] {
          padding: 12px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 1rem;
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }

        .next-btn, .prev-btn, .generate-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .next-btn, .generate-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .prev-btn {
          background: #e0e6ed;
          color: #2c3e50;
        }

        .next-btn:hover, .generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .next-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .generate-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .generate-btn {
          font-size: 1.2rem;
          padding: 20px 40px;
        }

        .code-output {
          margin-top: 40px;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .download-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .summary-section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #dee2e6;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .summary-item {
          padding: 10px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e0e6ed;
        }

        .code-container {
          position: relative;
          margin: 20px 0;
        }

        .code-block {
          background: #2d3748;
          color: #e2e8f0;
          padding: 30px;
          border-radius: 15px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.6;
          max-height: 500px;
          overflow-y: auto;
        }

        .output-actions {
          display: flex;
          gap: 10px;
        }

        .copy-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .code-info {
          text-align: center;
          color: #6c757d;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        .custom-section {
          margin-bottom: 40px;
        }

        .custom-toggle {
          margin-bottom: 20px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
          cursor: pointer;
        }

        .toggle-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .custom-editor {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 25px;
          border: 2px solid #e0e6ed;
        }

        .custom-editor h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .custom-editor p {
          margin: 0 0 15px 0;
          color: #6c757d;
        }

        .code-editor {
          width: 100%;
          padding: 20px;
          border: 2px solid #e0e6ed;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 1.5;
          background: #2d3748;
          color: #e2e8f0;
          resize: vertical;
          min-height: 300px;
        }

        .code-editor:focus {
          outline: none;
          border-color: #667eea;
        }

        .editor-help {
          margin-top: 20px;
          padding: 15px;
          background: #e8f4fd;
          border-radius: 8px;
          border-left: 4px solid #007bff;
        }

        .editor-help p {
          margin: 0 0 10px 0;
          font-weight: 600;
          color: #0056b3;
        }

        .editor-help ul {
          margin: 0;
          padding-left: 20px;
        }

        .config-sections {
          display: grid;
          gap: 30px;
          margin-bottom: 40px;
        }

        .config-section {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 25px;
          border: 2px solid #e0e6ed;
        }

        .config-section h3 {
          margin: 0 0 20px 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }

        .loading-message {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
          font-size: 1.2rem;
        }

        .selected-summary {
          margin-bottom: 30px;
          padding: 20px;
          background: #e8f5e8;
          border-radius: 12px;
          border: 2px solid #28a745;
        }

        .selected-summary h3 {
          margin: 0 0 15px 0;
          color: #155724;
        }

        .selected-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .service-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid #28a745;
          font-size: 0.9rem;
        }

        .service-chip button {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          cursor: pointer;
          font-size: 12px;
        }

        .service-card.selected {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          cursor: default;
          position: relative;
        }

        .selected-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(255,255,255,0.9);
          color: #28a745;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2rem;
          }
          
          .steps-nav {
            flex-wrap: wrap;
            gap: 10px;
          }
          
          .step {
            padding: 10px 15px;
            margin: 5px;
          }
          
          .step-content {
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .services-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .loading-message {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default TerraformGenerator;