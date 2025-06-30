output "s3_bucket_name" {
  value = aws_s3_bucket.logs.bucket
}

output "sqs_queue_url" {
  value = aws_sqs_queue.queue.url
}

output "sns_topic_arn" {
  value = aws_sns_topic.alerts.arn
}
