# CloudTarkk InfraGen - AWS Infrastructure

This Terraform configuration creates AWS infrastructure for the CloudTarkk InfraGen application.

## Resources Created

### Networking
- **VPC** with DNS support
- **Public Subnets** (2) for load balancers
- **Private Subnets** (2) for EKS nodes
- **Internet Gateway** for public access
- **Route Tables** and associations

### EKS Cluster
- **EKS Cluster** with specified Kubernetes version
- **EKS Node Group** with auto-scaling
- **IAM Roles** and policies for cluster and nodes

### Container Registry
- **ECR Repositories** for backend and frontend images
- **Lifecycle Policies** to manage image retention

## Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** v1.0+ installed
3. **kubectl** for cluster management

## Usage

1. **Copy variables file**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit variables** in `terraform.tfvars` as needed

3. **Initialize Terraform**:
   ```bash
   terraform init
   ```

4. **Plan deployment**:
   ```bash
   terraform plan
   ```

5. **Apply configuration**:
   ```bash
   terraform apply
   ```

6. **Configure kubectl**:
   ```bash
   aws eks update-kubeconfig --region us-east-1 --name cloudtarkk-infragen-cluster
   ```

## Outputs

- **VPC and Subnet IDs** for reference
- **EKS Cluster** endpoint and certificate
- **ECR Repository URLs** for container images
- **kubectl configuration** command

## Cost Optimization

- Uses **t3.medium** instances by default
- **Auto-scaling** from 1-4 nodes
- **ECR lifecycle policies** to manage storage costs

## Security Features

- **Private subnets** for worker nodes
- **IAM roles** with least privilege
- **ECR image scanning** enabled
- **VPC isolation** for cluster resources

## Cleanup

To destroy all resources:
```bash
terraform destroy
```

**Warning**: This will delete all AWS resources created by this configuration.