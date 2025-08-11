# AWS Terraform Generator

## Overview
The AWS Terraform Generator is a web-based tool that allows users to visually select and configure AWS services, then automatically generate Terraform Infrastructure as Code (IaC) configurations.

## Features
- **Visual Service Selection**: Choose from 11 core AWS services
- **Dynamic Configuration**: Real-time configuration forms based on service templates
- **Code Generation**: Automatically generates production-ready Terraform code
- **Download Support**: Export generated configurations as `.tf` files
- **Provider Configuration**: Customizable AWS provider settings

## Supported AWS Services

### Compute
- **EC2 Instance**: Virtual servers with security groups and tags
- **Lambda Function**: Serverless functions with IAM roles

### Database
- **RDS Database**: Managed relational databases with security configurations

### Storage
- **S3 Bucket**: Object storage with versioning, encryption, and access controls

### Networking
- **VPC Network**: Virtual private clouds with subnets
- **Load Balancer**: Application load balancers with health checks

### Security
- **IAM Role**: Service roles with assume role policies and managed policy attachments
- **IAM Policy**: Custom policies with JSON policy documents
- **IAM User**: Individual users with policy attachments and optional access keys
- **IAM Group**: User groups with policy attachments and membership management

### Monitoring
- **CloudWatch**: Log groups and metric alarms

## API Endpoints

### GET /api/terraform/services
Returns available AWS services for selection.

**Response:**
```json
{
  "services": [
    {
      "id": "ec2",
      "name": "EC2 Instance",
      "category": "Compute"
    }
  ]
}
```

### GET /api/terraform/templates/:serviceType
Returns configuration template for a specific service.

**Response:**
```json
{
  "template": {
    "instance_type": "t3.micro",
    "ami": "ami-0c02fb55956c7d316",
    "key_name": "my-key"
  }
}
```

### POST /api/terraform/generate
Generates Terraform configuration from selected services.

**Request:**
```json
{
  "services": [
    {
      "type": "ec2",
      "name": "web_server",
      "config": {
        "instance_type": "t3.micro",
        "ami": "ami-0c02fb55956c7d316"
      }
    }
  ],
  "provider": {
    "region": "us-east-1",
    "profile": "default"
  }
}
```

**Response:**
```json
{
  "success": true,
  "terraform": "terraform {\n  required_providers {\n    aws = {\n      source  = \"hashicorp/aws\"\n      version = \"~> 5.0\"\n    }\n  }\n}\n\nprovider \"aws\" {\n  region = \"us-east-1\"\n}",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Usage Examples

### IAM Role with Policies
```hcl
resource "aws_iam_role" "app_role" {
  name = "AppRole"
  
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Effect": "Allow",
        "Principal": {
          "Service": "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "app_role_amazons3readonlyaccess" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
  role       = aws_iam_role.app_role.name
}
```

### IAM User with Access Key
```hcl
resource "aws_iam_user" "app_user" {
  name = "AppUser"
  path = "/"
}

resource "aws_iam_user_policy_attachment" "app_user_amazons3readonlyaccess" {
  user       = aws_iam_user.app_user.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

resource "aws_iam_access_key" "app_user_key" {
  user = aws_iam_user.app_user.name
}
```

### Custom IAM Policy
```hcl
resource "aws_iam_policy" "custom_policy" {
  name        = "CustomS3Policy"
  description = "Custom IAM policy for S3 access"
  
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "s3:GetObject"
        ],
        "Resource": [
          "arn:aws:s3:::my-bucket/*"
        ]
      }
    ]
  })
}
```

### IAM Group with Users
```hcl
resource "aws_iam_group" "developers" {
  name = "Developers"
  path = "/"
}

resource "aws_iam_group_policy_attachment" "developers_amazons3readonlyaccess" {
  group      = aws_iam_group.developers.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}
```

### S3 Bucket with Security
```hcl
resource "aws_s3_bucket" "data_bucket" {
  bucket = "my-unique-bucket"
  
  tags = {
    Name = "data_bucket"
  }
}

resource "aws_s3_bucket_versioning" "data_bucket_versioning" {
  bucket = aws_s3_bucket.data_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "data_bucket_encryption" {
  bucket = aws_s3_bucket.data_bucket.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

### VPC with Subnets
```hcl
resource "aws_vpc" "main_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "main_vpc"
  }
}

resource "aws_subnet" "main_vpc_subnet_1" {
  vpc_id            = aws_vpc.main_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "main_vpc_subnet_1"
    Type = "public"
  }
}
```

## Frontend Components

### TerraformGenerator.js
Main React component handling:
- Service selection interface
- Dynamic configuration forms
- Terraform code generation
- File download functionality

### Key Features:
- **Real-time Configuration**: Updates configuration as users modify fields
- **Template Loading**: Automatically loads service-specific templates
- **Validation**: Client-side validation before generation
- **Export**: Download generated Terraform as `.tf` files

## Security Features
- **JWT Authentication**: All endpoints require valid authentication
- **Input Validation**: Joi schema validation for all inputs
- **Rate Limiting**: Prevents abuse of generation endpoints
- **Sanitized Responses**: No sensitive information in error messages

## Development Setup

### Backend Dependencies
```bash
cd backend
npm install uuid joi
```

### Frontend Integration
The Terraform Generator is integrated into the main application with:
- Navigation menu access
- Dashboard quick access card
- Responsive design for mobile/desktop

### Testing the Generator
1. Login to the application
2. Navigate to "Terraform Generator"
3. Select AWS services (EC2, S3, etc.)
4. Configure service parameters
5. Generate and download Terraform code

## Future Enhancements
- **Multi-Cloud Support**: Azure and GCP providers
- **Advanced Templates**: More complex service configurations
- **Validation**: Terraform syntax validation
- **Version Control**: Git integration for generated code
- **Collaboration**: Team sharing and templates
- **Cost Estimation**: AWS cost calculator integration

## Architecture Benefits
- **Microservices**: Separate service for Terraform generation
- **Scalable**: Stateless generation process
- **Extensible**: Easy to add new AWS services
- **Maintainable**: Clean separation of concerns
- **Secure**: Authentication and validation at all levels