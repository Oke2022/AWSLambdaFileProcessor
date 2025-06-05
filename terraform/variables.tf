# terraform/variables.tf

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "project_name" {
  description = "Lambda_file_processor"
  type        = string
  default     = "serverless-file-processor"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
