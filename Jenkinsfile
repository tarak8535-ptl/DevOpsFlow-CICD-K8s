pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/devopsflow/backend:${env.BRANCH_NAME.replaceAll('/', '_')}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/devopsflow/frontend:${env.BRANCH_NAME.replaceAll('/', '_')}"
        DOCKER_CREDENTIALS = credentials('docker-credentials')
        ARGOCD_SERVER = credentials('argocd-server-url')
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
        
        stage('Build and Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'staging'
                }
            }
            steps {
                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login $DOCKER_REGISTRY -u $DOCKER_CREDENTIALS_USR --password-stdin'
                
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
        
        stage('Deploy to Staging') {
            when {
                branch 'staging'
            }
            steps {
                withKubeConfig([credentialsId: 'kube-staging']) {
                    sh 'kubectl apply -f k8s/namespace.yml'
                    sh "sed -i 's|image:.*|image: $BACKEND_IMAGE|g' k8s/backend-deployment.yml"
                    sh 'kubectl apply -f k8s/'
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
                withCredentials([string(credentialsId: 'argocd-auth-token', variable: 'ARGOCD_AUTH_TOKEN')]) {
                    sh '''
                        curl -sSL -o argocd https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
                        chmod +x argocd
                        ./argocd app sync devops-flow --auth-token $ARGOCD_AUTH_TOKEN --server $ARGOCD_SERVER --insecure
                        ./argocd app wait devops-flow --auth-token $ARGOCD_AUTH_TOKEN --server $ARGOCD_SERVER --insecure
                    '''
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