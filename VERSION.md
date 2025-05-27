# DevOpsFlow-CICD-K8s Version History

## v1.0.2 (2025-05-29)
### Security
- Added explicit GitHub Actions permissions following principle of least privilege
- Set default permissions to read-only with specific write permissions only where needed

## v1.0.1 (2025-05-28)
### Security
- Updated jsonwebtoken dependency from 8.5.1 to 9.0.0 to fix potential signature validation bypass vulnerability

## v1.0.0 (2025-05-25)
### Added
- Multi-platform CI/CD support (GitHub Actions, Bitbucket Pipelines, Jenkins)
- Flow diagrams for CI/CD, architecture, observability, security, and deployment
- CI/CD platform comparison table

### Changed
- Optimized pipeline configurations for better parallelization
- Enhanced security features with rate limiting and secure token verification
- Improved documentation with detailed project structure

### Removed
- GitLab CI configuration (replaced with GitHub Actions)

## v0.7.0 (2025-05-24)
### Added
- Detailed features documentation
- Deployment best practices
- Quick start instructions

### Changed
- Enhanced project overview

## v0.6.0 (2025-04-02)
### Added
- Kubernetes deployment configurations
- Service configurations for frontend and backend
- Ingress and namespace definitions
- Authentication implementation
- Initial project structure setup

### Changed
- Backend structure refactoring
- UI component enhancements