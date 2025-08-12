pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        PROJECT_NAME = 'cloudtarkk-infragen'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
        BACKEND_IMAGE = "${ECR_REGISTRY}/${PROJECT_NAME}/backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE = "${ECR_REGISTRY}/${PROJECT_NAME}/frontend:${env.BUILD_NUMBER}"
        AWS_CREDENTIALS = credentials('aws-credentials')
        TERRAFORM_DIR = 'terraform'
    }
    
    stages {
        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npm run lint'
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                                junit allowEmptyResults: true, testResults: 'backend/junit.xml'
                            }
                            
                            catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                                publishHTML(target: [
                                    allowMissing: true,
                                    alwaysLinkToLastBuild: true,
                                    keepAll: true,
                                    reportDir: 'backend/coverage',
                                    reportFiles: 'index.html',
                                    reportName: 'Backend Coverage Report'
                                ])
                            }
                        }
                    }
                }
                
                stage('Frontend Tests') {
                    agent {
                        docker {
                            image 'node:18-alpine'
                            reuseNode true
                        }
                    }
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run lint'
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                                junit allowEmptyResults: true, testResults: 'frontend/junit.xml'
                            }
                            
                            catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                                publishHTML(target: [
                                    allowMissing: true,
                                    alwaysLinkToLastBuild: true,
                                    keepAll: true,
                                    reportDir: 'frontend/coverage',
                                    reportFiles: 'index.html',
                                    reportName: 'Frontend Coverage Report'
                                ])
                            }
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            parallel {
                stage('Backend Security') {
                    steps {
                        sh 'docker run --rm -v $WORKSPACE/backend:/app aquasec/trivy:latest fs --exit-code 0 --severity HIGH,CRITICAL /app'
                    }
                }
                stage('Frontend Security') {
                    steps {
                        sh 'docker run --rm -v $WORKSPACE/frontend:/app aquasec/trivy:latest fs --exit-code 0 --severity HIGH,CRITICAL /app'
                    }
                }
            }
        }
        
        stage('Infrastructure') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    dir('terraform') {
                        sh 'terraform init'
                        sh 'terraform plan -out=tfplan'
                        sh 'terraform apply -auto-approve tfplan'
                        script {
                            env.AWS_ACCOUNT_ID = sh(script: 'aws sts get-caller-identity --query Account --output text', returnStdout: true).trim()
                            env.EKS_CLUSTER_NAME = sh(script: 'terraform output -raw eks_cluster_id', returnStdout: true).trim()
                        }
                    }
                }
            }
        }
        
        stage('Build and Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY'
                    
                    dir('backend') {
                        sh 'docker build -t $BACKEND_IMAGE .'
                        sh 'docker push $BACKEND_IMAGE'
                    }
                    
                    dir('frontend') {
                        sh 'docker build -t $FRONTEND_IMAGE .'
                        sh 'docker push $FRONTEND_IMAGE'
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'staging'
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh 'aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME'
                    sh 'kubectl apply -f k8s/namespace.yml'
                    sh "sed -i 's|image:.*backend.*|image: $BACKEND_IMAGE|g' k8s/backend-deployment.yml"
                    sh "sed -i 's|image:.*frontend.*|image: $FRONTEND_IMAGE|g' k8s/deployment.yml"
                    sh 'kubectl apply -f k8s/'
                    sh 'kubectl rollout status deployment/backend-deployment -n devops'
                    sh 'kubectl rollout status deployment/frontend-deployment -n devops'
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            input {
                message "Deploy to production?"
                ok "Yes"
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) {
                    sh 'aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME'
                    sh 'kubectl apply -f k8s/namespace.yml'
                    sh "sed -i 's|image:.*backend.*|image: $BACKEND_IMAGE|g' k8s/backend-deployment.yml"
                    sh "sed -i 's|image:.*frontend.*|image: $FRONTEND_IMAGE|g' k8s/deployment.yml"
                    sh 'kubectl apply -f k8s/'
                    sh 'kubectl rollout status deployment/backend-deployment -n devops'
                    sh 'kubectl rollout status deployment/frontend-deployment -n devops'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}