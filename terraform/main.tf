resource "aws_s3_bucket" "logs" {
  bucket = "${var.project_name}-logs"

  tags = {
    Name = "${var.project_name}-logs"
  }
}
resource "aws_sqs_queue" "queue" {
  name                      = "${var.project_name}-queue"
  message_retention_seconds = 86400             # keep messages for 1 day
  visibility_timeout_seconds = 30               # hide message for 30 seconds when worker picks up
  tags = {
    Environment = "dev"
    Project     = var.project_name
  }
}
resource "aws_sns_topic" "alerts" {
  name         = "${var.project_name}-alerts"
  display_name = "CloudQueueApp Alerts"
  
  tags = {
    Environment = "dev"
    Project     = var.project_name
  }
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.sns_email
}
