// Jenkinsfile

pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-2'
        TF_VERSION = '1.5.0'
        AWS_CREDENTIALS = credentials('aws-credentials')
    }
    
    tools {
        terraform "${TF_VERSION}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Terraform Format Check') {
            steps {
                dir('terraform') {
                    sh 'terraform fmt -check'
                }
            }
        }
        
        stage('Terraform Init') {
            steps {
                dir('terraform') {
                    sh 'terraform init'
                }
            }
        }
        
        stage('Terraform Validate') {
            steps {
                dir('terraform') {
                    sh 'terraform validate'
                }
            }
        }
        
        stage('Terraform Plan') {
            steps {
                dir('terraform') {
                    sh '''
                        terraform plan -no-color \
                            -var="aws_region=${AWS_REGION}" \
                            -out=tfplan
                    '''
                }
            }
        }
        
        stage('Approval') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: 'Apply Terraform changes?', ok: 'Apply',
                          submitterParameter: 'APPROVER'
                }
            }
        }
        
        stage('Terraform Apply') {
            when {
                branch 'main'
            }
            steps {
                dir('terraform') {
                    sh 'terraform apply -auto-approve tfplan'
                }
            }
        }
        
        stage('Get Terraform Outputs') {
            when {
                branch 'main'
            }
            steps {
                dir('terraform') {
                    script {
                        env.S3_BUCKET = sh(script: 'terraform output -raw s3_bucket_name', returnStdout: true).trim()
                        env.LAMBDA_FUNCTION = sh(script: 'terraform output -raw lambda_function_name', returnStdout: true).trim()
                        env.API_URL = sh(script: 'terraform output -raw api_gateway_url', returnStdout: true).trim()
                    }
                }
            }
        }
        
        stage('Update Lambda Function') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    cd lambda
                    zip -r ../lambda_function.zip .
                    cd ..
                    aws lambda update-function-code \
                        --function-name ${LAMBDA_FUNCTION} \
                        --zip-file fileb://lambda_function.zip \
                        --region ${AWS_REGION}
                '''
            }
        }
        
        stage('Test API Gateway') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    echo "Testing API Gateway endpoint..."
                    curl -X GET "${API_URL}" \
                        -H "Content-Type: application/json" \
                        -w "HTTP Status: %{http_code}\\n"
                '''
            }
        }
    }
    
    post {
        success {
            echo '''
                🚀 Deployment Successful!
                📦 S3 Bucket: ${S3_BUCKET}
                ⚡ Lambda Function: ${LAMBDA_FUNCTION}  
                🌐 API Gateway URL: ${API_URL}
            '''
        }
        failure {
            echo '❌ Deployment failed. Check the logs for details.'
        }
        cleanup {
            cleanWs()
        }
    }
}
