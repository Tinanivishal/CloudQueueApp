const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const sqs = new AWS.SQS({ region: process.env.AWS_REGION });
const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const sns = new AWS.SNS({ region: process.env.AWS_REGION });

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;
const S3_BUCKET = process.env.S3_BUCKET;

async function poll() {
  while (true) {
    const result = await sqs.receiveMessage({
      QueueUrl: SQS_QUEUE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10
    }).promise();

    if (result.Messages) {
      for (const msg of result.Messages) {
        const body = JSON.parse(msg.Body);

        // store in S3
        await s3.putObject({
          Bucket: S3_BUCKET,
          Key: `${uuidv4()}.json`,
          Body: JSON.stringify(body)
        }).promise();

        // send SNS if payment failed
        if (body.type === 'payment' && body.data.status === 'failed') {
          await sns.publish({
            TopicArn: SNS_TOPIC_ARN,
            Subject: 'Payment Failed',
            Message: `Payment failed for order: ${JSON.stringify(body.data)}`
          }).promise();
        }

        // delete message from queue
        await sqs.deleteMessage({
          QueueUrl: SQS_QUEUE_URL,
          ReceiptHandle: msg.ReceiptHandle
        }).promise();
      }
    }
  }
}

poll().catch(console.error);
    