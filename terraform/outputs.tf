# terraform/outputs.tf

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.upload_bucket.bucket
}

output "lambda_function_name" {
  description = "Name of the Lambda function"  
  value       = aws_lambda_function.file_processor.function_name
}

output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = "${aws_api_gateway_deployment.lambda_deployment.invoke_url}/process"
}

output "api_gateway_id" {
  description = "ID of the API Gateway"
  value       = aws_api_gateway_rest_api.lambda_api.id
}
