const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { generateTerraform } = require('../services/terraformGenerator');
const Joi = require('joi');

const router = express.Router();

// Validation schema
const configSchema = Joi.object({
  services: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('ec2', 'rds', 's3', 'vpc', 'lambda', 'iam_role', 'iam_policy', 'iam_user', 'iam_group', 'cloudwatch', 'elb').required(),
      name: Joi.string().required(),
      config: Joi.object().required()
    })
  ).min(1).required(),
  provider: Joi.object({
    region: Joi.string().default('us-east-1'),
    profile: Joi.string().allow('').optional()
  }).default({ region: 'us-east-1' }),
  customConfig: Joi.object({
    tags: Joi.object().optional(),
    security: Joi.object().optional(),
    monitoring: Joi.object().optional(),
    variables: Joi.object().optional()
  }).optional()
}).unknown(true);

// Get available AWS services
router.get('/services', verifyToken, (req, res) => {
  const services = [
    { id: 'ec2', name: 'EC2 Instance', category: 'Compute' },
    { id: 'lambda', name: 'Lambda Function', category: 'Compute' },
    { id: 'rds', name: 'RDS Database', category: 'Database' },
    { id: 's3', name: 'S3 Bucket', category: 'Storage' },
    { id: 'vpc', name: 'VPC Network', category: 'Networking' },
    { id: 'elb', name: 'Load Balancer', category: 'Networking' },
    { id: 'iam_role', name: 'IAM Role', category: 'Security' },
    { id: 'iam_policy', name: 'IAM Policy', category: 'Security' },
    { id: 'iam_user', name: 'IAM User', category: 'Security' },
    { id: 'iam_group', name: 'IAM Group', category: 'Security' },
    { id: 'cloudwatch', name: 'CloudWatch', category: 'Monitoring' }
  ];
  
  res.json({ services });
});

// Generate Terraform configuration
router.post('/generate', verifyToken, async (req, res) => {
  try {
    console.log('=== TERRAFORM GENERATE REQUEST ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Body type:', typeof req.body);
    console.log('Services array:', req.body?.services);
    
    const { error, value } = configSchema.validate(req.body);
    if (error) {
      console.error('=== VALIDATION ERROR ===');
      console.error('Error details:', error.details);
      console.error('Error message:', error.details[0].message);
      console.error('Error path:', error.details[0].path);
      return res.status(400).json({ 
        error: error.details[0].message,
        path: error.details[0].path,
        received: req.body
      });
    }

    const terraformConfig = await generateTerraform(value);
    
    res.json({
      success: true,
      terraform: terraformConfig,
      timestamp: new Date().toISOString(),
      hasCustomConfig: !!value.customConfig
    });
  } catch (error) {
    console.error('=== TERRAFORM GENERATION ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Failed to generate Terraform configuration' });
  }
});

// Get AWS regions from internet
router.get('/regions', verifyToken, async (req, res) => {
  try {
    const regions = [
      { code: 'us-east-1', name: 'US East (N. Virginia)', flag: '🇺🇸' },
      { code: 'us-west-2', name: 'US West (Oregon)', flag: '🇺🇸' },
      { code: 'eu-west-1', name: 'Europe (Ireland)', flag: '🇮🇪' },
      { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
      { code: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', flag: '🇯🇵' },
      { code: 'ca-central-1', name: 'Canada (Central)', flag: '🇨🇦' }
    ];
    res.json({ regions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

// Get EC2 instance types from internet
router.get('/instance-types', verifyToken, async (req, res) => {
  try {
    const instanceTypes = [
      { type: 't3.micro', vcpu: 2, memory: '1 GiB', price: '$0.0104/hour' },
      { type: 't3.small', vcpu: 2, memory: '2 GiB', price: '$0.0208/hour' },
      { type: 't3.medium', vcpu: 2, memory: '4 GiB', price: '$0.0416/hour' },
      { type: 'm5.large', vcpu: 2, memory: '8 GiB', price: '$0.096/hour' },
      { type: 'c5.large', vcpu: 2, memory: '4 GiB', price: '$0.085/hour' }
    ];
    res.json({ instanceTypes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch instance types' });
  }
});

// Get service configuration templates
router.get('/templates/:serviceType', verifyToken, (req, res) => {
  const { serviceType } = req.params;
  
  const templates = {
    ec2: {
      instance_type: 't3.micro',
      ami: 'ami-0c02fb55956c7d316',
      key_name: 'my-key',
      security_groups: ['default'],
      monitoring: false,
      ebs_optimized: false,
      tenancy: 'default',
      associate_public_ip_address: true,
      disable_api_termination: false,
      root_block_device: {
        volume_type: 'gp3',
        volume_size: 8,
        encrypted: true,
        delete_on_termination: true
      }
    },
    rds: {
      engine: 'mysql',
      engine_version: '8.0.35',
      instance_class: 'db.t3.micro',
      allocated_storage: 20,
      max_allocated_storage: 100,
      storage_type: 'gp3',
      storage_encrypted: true,
      db_name: 'mydb',
      username: 'admin',
      manage_master_user_password: true,
      multi_az: false,
      publicly_accessible: false,
      backup_retention_period: 7,
      backup_window: '03:00-04:00',
      maintenance_window: 'sun:04:00-sun:05:00',
      deletion_protection: false,
      skip_final_snapshot: true
    },
    s3: {
      bucket_name: 'my-unique-bucket',
      versioning: true,
      encryption: true,
      public_access_block: true,
      object_lock_enabled: false,
      lifecycle_enabled: false,
      lifecycle_expiration_days: 30,
      storage_class: 'STANDARD',
      mfa_delete: false
    },
    vpc: {
      cidr_block: '10.0.0.0/16',
      enable_dns_hostnames: true,
      enable_dns_support: true,
      instance_tenancy: 'default',
      enable_network_address_usage_metrics: false,
      subnets: [
        { cidr: '10.0.1.0/24', availability_zone: 'us-east-1a', type: 'public', map_public_ip_on_launch: true },
        { cidr: '10.0.2.0/24', availability_zone: 'us-east-1b', type: 'private', map_public_ip_on_launch: false }
      ]
    },
    lambda: {
      runtime: 'nodejs18.x',
      handler: 'index.handler',
      memory_size: 128,
      timeout: 30,
      reserved_concurrent_executions: -1,
      architectures: ['x86_64'],
      package_type: 'Zip',
      publish: false,
      environment_variables: {},
      dead_letter_config: null,
      tracing_config: 'PassThrough'
    },
    iam_role: {
      role_name: 'MyRole',
      assume_role_policy: 'ec2',
      policies: ['AmazonS3ReadOnlyAccess']
    },
    iam_policy: {
      policy_name: 'MyPolicy',
      description: 'Custom IAM policy',
      policy_document: {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: ['arn:aws:s3:::my-bucket/*']
        }]
      }
    },
    iam_user: {
      user_name: 'MyUser',
      path: '/',
      policies: ['AmazonS3ReadOnlyAccess'],
      create_access_key: false
    },
    iam_group: {
      group_name: 'MyGroup',
      path: '/',
      policies: ['AmazonS3ReadOnlyAccess'],
      users: []
    },
    cloudwatch: {
      log_group_name: '/aws/lambda/my-function',
      retention_in_days: 14,
      alarm_name: 'HighCPU',
      metric_name: 'CPUUtilization',
      threshold: 80
    },
    elb: {
      name: 'my-load-balancer',
      load_balancer_type: 'application',
      scheme: 'internet-facing',
      ip_address_type: 'ipv4',
      enable_deletion_protection: false,
      enable_cross_zone_load_balancing: true,
      idle_timeout: 60,
      health_check_path: '/health',
      health_check_interval: 30,
      health_check_timeout: 5,
      healthy_threshold: 2,
      unhealthy_threshold: 2
    }
  };

  if (!templates[serviceType]) {
    return res.status(404).json({ error: 'Service template not found' });
  }

  res.json({ template: templates[serviceType] });
});

module.exports = router;