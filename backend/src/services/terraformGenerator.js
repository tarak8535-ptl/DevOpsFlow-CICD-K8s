const { v4: uuidv4 } = require('uuid');

class TerraformGenerator {
  constructor() {
    this.templates = {
      provider: this.generateProvider,
      ec2: this.generateEC2,
      rds: this.generateRDS,
      s3: this.generateS3,
      vpc: this.generateVPC,
      lambda: this.generateLambda,
      iam_role: this.generateIAMRole,
      iam_policy: this.generateIAMPolicy,
      iam_user: this.generateIAMUser,
      iam_group: this.generateIAMGroup,
      cloudwatch: this.generateCloudWatch,
      elb: this.generateELB
    };
  }

  async generateTerraform(config) {
    let terraform = '';
    
    // Generate provider configuration
    terraform += this.generateProvider(config.provider);
    terraform += '\n';
    
    // Add locals for common configuration
    if (config.customConfig) {
      terraform += this.generateLocals(config.customConfig);
      terraform += '\n';
    }
    
    // Generate resources with custom config applied
    for (const service of config.services) {
      if (this.templates[service.type]) {
        terraform += this.templates[service.type](service.name, service.config, config.customConfig);
        terraform += '\n';
      }
    }
    
    return terraform;
  }

  generateLocals(customConfig) {
    const tags = customConfig?.tags || {};
    const security = customConfig?.security || {};
    const monitoring = customConfig?.monitoring || {};
    
    return `locals {
  common_tags = {
    Environment = "${tags.Environment || 'dev'}"
    Project     = "${tags.Project || 'terraform-infragen'}"
    Owner       = "${tags.Owner || 'CloudTarkk'}"
    ManagedBy   = "CloudTarkk-InfraGen"
  }
  
  security_config = {
    encryption_enabled = ${security.encryption || true}
    backup_retention   = ${security.backup_retention || 7}
    multi_az          = ${security.multi_az || false}
  }
  
  monitoring_config = {
    cloudwatch_level = "${monitoring.cloudwatch || 'basic'}"
    log_retention   = ${monitoring.log_retention || 14}
    xray_enabled    = ${monitoring.xray || false}
  }
}`;
  }

  generateProvider(config) {
    return `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "${config.region}"${config.profile && config.profile.trim() ? `\n  profile = "${config.profile}"` : ''}
}`;
  }

  generateEC2(name, config, customConfig) {
    const tags = customConfig ? 'merge(local.common_tags, {\n    Name = "' + name + '"\n  })' : `{\n    Name = "${name}"\n  }`;
    
    let ec2Config = `resource "aws_instance" "${name}" {
  ami           = "${config.ami || 'ami-0c02fb55956c7d316'}"
  instance_type = "${config.instance_type || 't3.micro'}"
  ${config.key_name ? `key_name      = "${config.key_name}"` : ''}
  
  vpc_security_group_ids = [${config.security_groups?.map(sg => `"${sg}"`).join(', ') || '"default"'}]
  
  monitoring                = ${config.monitoring || false}
  ebs_optimized            = ${config.ebs_optimized || false}
  tenancy                  = "${config.tenancy || 'default'}"
  associate_public_ip_address = ${config.associate_public_ip_address !== false}
  disable_api_termination  = ${config.disable_api_termination || false}
  
  tags = ${tags}
}`;

    if (config.root_block_device) {
      ec2Config += `\n\n  root_block_device {
    volume_type = "${config.root_block_device.volume_type || 'gp3'}"
    volume_size = ${config.root_block_device.volume_size || 8}
    encrypted   = ${config.root_block_device.encrypted !== false}
    delete_on_termination = ${config.root_block_device.delete_on_termination !== false}
  }`;
    }
    
    return ec2Config;
  }

  generateRDS(name, config) {
    return `resource "aws_db_instance" "${name}" {
  identifier     = "${name}"
  engine         = "${config.engine}"
  engine_version = "${config.engine_version}"
  instance_class = "${config.instance_class}"
  allocated_storage = ${config.allocated_storage}
  
  db_name  = "${config.db_name}"
  username = "${config.username}"
  ${config.manage_master_user_password ? 'manage_master_user_password = true' : `password = "${config.password}"`}
  
  skip_final_snapshot = true
  
  tags = {
    Name = "${name}"
  }
}`;
  }

  generateS3(name, config) {
    let s3Config = `resource "aws_s3_bucket" "${name}" {
  bucket = "${config.bucket_name}"
  
  tags = {
    Name = "${name}"
  }
}`;

    if (config.versioning) {
      s3Config += `\n\nresource "aws_s3_bucket_versioning" "${name}_versioning" {
  bucket = aws_s3_bucket.${name}.id
  versioning_configuration {
    status = "Enabled"
  }
}`;
    }

    if (config.encryption) {
      s3Config += `\n\nresource "aws_s3_bucket_server_side_encryption_configuration" "${name}_encryption" {
  bucket = aws_s3_bucket.${name}.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`;
    }

    if (config.public_access_block) {
      s3Config += `\n\nresource "aws_s3_bucket_public_access_block" "${name}_pab" {
  bucket = aws_s3_bucket.${name}.id
  
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`;
    }

    return s3Config;
  }

  generateVPC(name, config) {
    let vpcConfig = `resource "aws_vpc" "${name}" {
  cidr_block           = "${config.cidr_block}"
  enable_dns_hostnames = ${config.enable_dns_hostnames}
  enable_dns_support   = ${config.enable_dns_support}
  
  tags = {
    Name = "${name}"
  }
}`;

    if (config.subnets) {
      config.subnets.forEach((subnet, index) => {
        const subnetName = `${name}_subnet_${index + 1}`;
        vpcConfig += `\n\nresource "aws_subnet" "${subnetName}" {
  vpc_id            = aws_vpc.${name}.id
  cidr_block        = "${subnet.cidr}"
  availability_zone = "${subnet.availability_zone}"
  ${subnet.type === 'public' ? 'map_public_ip_on_launch = true' : ''}
  
  tags = {
    Name = "${subnetName}"
    Type = "${subnet.type}"
  }
}`;
      });
    }

    return vpcConfig;
  }

  generateLambda(name, config) {
    return `resource "aws_lambda_function" "${name}" {
  filename         = "${name}.zip"
  function_name    = "${name}"
  role            = aws_iam_role.${name}_role.arn
  handler         = "${config.handler}"
  runtime         = "${config.runtime}"
  memory_size     = ${config.memory_size}
  timeout         = ${config.timeout}
  
  ${Object.keys(config.environment_variables || {}).length > 0 ? `environment {
    variables = {${Object.entries(config.environment_variables).map(([k, v]) => `\n      ${k} = "${v}"`).join('')}
    }
  }` : ''}
}

resource "aws_iam_role" "${name}_role" {
  name = "${name}-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "${name}_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.${name}_role.name
}`;
  }

  generateIAMRole(name, config) {
    const assumeRolePolicies = {
      ec2: {
        Version: "2012-10-17",
        Statement: [{
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: { Service: "ec2.amazonaws.com" }
        }]
      },
      lambda: {
        Version: "2012-10-17",
        Statement: [{
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: { Service: "lambda.amazonaws.com" }
        }]
      },
      ecs: {
        Version: "2012-10-17",
        Statement: [{
          Action: "sts:AssumeRole",
          Effect: "Allow",
          Principal: { Service: "ecs-tasks.amazonaws.com" }
        }]
      }
    };

    return `resource "aws_iam_role" "${name}" {
  name = "${config.role_name}"
  
  assume_role_policy = jsonencode(${JSON.stringify(assumeRolePolicies[config.assume_role_policy] || assumeRolePolicies.ec2, null, 2)})
}

${config.policies.map(policy => `resource "aws_iam_role_policy_attachment" "${name}_${policy.toLowerCase().replace(/[^a-z0-9]/g, '_')}" {
  policy_arn = "arn:aws:iam::aws:policy/${policy}"
  role       = aws_iam_role.${name}.name
}`).join('\n\n')}`;
  }

  generateIAMPolicy(name, config) {
    return `resource "aws_iam_policy" "${name}" {
  name        = "${config.policy_name}"
  description = "${config.description}"
  
  policy = jsonencode(${JSON.stringify(config.policy_document, null, 2)})
}`;
  }

  generateIAMUser(name, config) {
    let userConfig = `resource "aws_iam_user" "${name}" {
  name = "${config.user_name}"
  path = "${config.path}"
}`;

    if (config.policies && config.policies.length > 0) {
      userConfig += '\n\n' + config.policies.map(policy => 
        `resource "aws_iam_user_policy_attachment" "${name}_${policy.toLowerCase().replace(/[^a-z0-9]/g, '_')}" {
  user       = aws_iam_user.${name}.name
  policy_arn = "arn:aws:iam::aws:policy/${policy}"
}`
      ).join('\n\n');
    }

    if (config.create_access_key) {
      userConfig += `\n\nresource "aws_iam_access_key" "${name}_key" {
  user = aws_iam_user.${name}.name
}`;
    }

    return userConfig;
  }

  generateIAMGroup(name, config) {
    let groupConfig = `resource "aws_iam_group" "${name}" {
  name = "${config.group_name}"
  path = "${config.path}"
}`;

    if (config.policies && config.policies.length > 0) {
      groupConfig += '\n\n' + config.policies.map(policy => 
        `resource "aws_iam_group_policy_attachment" "${name}_${policy.toLowerCase().replace(/[^a-z0-9]/g, '_')}" {
  group      = aws_iam_group.${name}.name
  policy_arn = "arn:aws:iam::aws:policy/${policy}"
}`
      ).join('\n\n');
    }

    if (config.users && config.users.length > 0) {
      groupConfig += '\n\n' + config.users.map((user, index) => 
        `resource "aws_iam_group_membership" "${name}_membership_${index}" {
  name = "${name}-membership-${index}"
  users = ["${user}"]
  group = aws_iam_group.${name}.name
}`
      ).join('\n\n');
    }

    return groupConfig;
  }

  generateCloudWatch(name, config) {
    return `resource "aws_cloudwatch_log_group" "${name}_logs" {
  name              = "${config.log_group_name}"
  retention_in_days = ${config.retention_in_days}
}

resource "aws_cloudwatch_metric_alarm" "${name}_alarm" {
  alarm_name          = "${config.alarm_name}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "${config.metric_name}"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "${config.threshold}"
  alarm_description   = "This metric monitors ${config.metric_name}"
}`;
  }

  generateELB(name, config) {
    return `resource "aws_lb" "${name}" {
  name               = "${config.name}"
  load_balancer_type = "${config.type}"
  scheme             = "${config.scheme}"
  
  subnets = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  
  tags = {
    Name = "${config.name}"
  }
}

resource "aws_lb_target_group" "${name}_tg" {
  name     = "${config.name}-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "${config.health_check_path}"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "${name}_listener" {
  load_balancer_arn = aws_lb.${name}.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.${name}_tg.arn
  }
}`;
  }
}

const generator = new TerraformGenerator();

module.exports = {
  generateTerraform: (config) => generator.generateTerraform(config)
};