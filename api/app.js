const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config()

const app = express();
app.use(express.json());

const sqs = new AWS.SQS({ region: 'ap-south-1' });
const sns = new AWS.SNS({ region: 'ap-south-1' });

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

// /order endpoint
app.post('/order', async (req, res) => {
  const message = { type: 'order', data: req.body };
  await sqs.sendMessage({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(message)
  }).promise();
  res.send({ status: 'Order event sent to SQS' });
});

// /payment endpoint
app.post('/payment', async (req, res) => {
  const message = { type: 'payment', data: req.body };
  await sqs.sendMessage({
    QueueUrl: SQS_QUEUE_URL,
    MessageBody: JSON.stringify(message)
  }).promise();
  res.send({ status: 'Payment event sent to SQS' });
});

// /notify endpoint
app.post('/notify', async (req, res) => {
  const { subject, message } = req.body;
  await sns.publish({
    TopicArn: SNS_TOPIC_ARN,
    Subject: subject,
    Message: message
  }).promise();
  res.send({ status: 'Notification sent via SNS' });
});

app.listen(3000, () => console.log('API server running on port 3000'));
