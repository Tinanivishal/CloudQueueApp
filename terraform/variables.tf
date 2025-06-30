variable "aws_region" {
  default = "ap-south-1"
}

variable "project_name" {
  default = "cloudqueueapp"
}

variable "sns_email" {
  description = "Email address to subscribe to SNS topic"
  default     = "tinanivishu2@gmail.com"
}
