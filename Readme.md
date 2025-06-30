# CloudQueueApp

An event-driven Node.js application using AWS services (SQS, SNS, S3) to decouple order & payment processing, store logs, and send real-time alerts.

## 🧩 Project Structure

CloudQueueApp/
api/ → Node.js Express API (order, payment, notify)
worker/ → Node.js worker (polls SQS, saves logs, triggers alerts)
terraform/ → Terraform configs to create SQS queue, SNS topic, S3 bucket
README.md

yaml
Copy
Edit

---

## ⚙️ How It Works

- Users send `/order` and `/payment` requests to the API.
- API publishes these events into an **SQS queue**.
- Worker service polls SQS:
  - Stores each event as JSON in **S3** for logging.
  - If payment failed → publishes alert to **SNS topic**.
- SNS topic fans out → sends email(s) to subscribers.
- API also has `/notify` endpoint → send custom manual alerts via SNS.

---

## ☁️ AWS Resources (created by Terraform)

- **SQS queue**: decouples API and worker, absorbs load spikes.
- **SNS topic**: sends alerts to subscribed emails.
- **S3 bucket**: keeps all processed events as logs.
- **(Optional)** IAM roles & policies for permissions.

---

## 🛠 Usage

### 1️⃣ Clone repo
```bash
git clone https://github.com/yourusername/CloudQueueApp.git
cd CloudQueueApp
2️⃣ Create AWS infra with Terraform
bash
Copy
Edit
cd terraform
terraform init
terraform apply
✅ Note: Confirm SNS email subscriptions by clicking the confirmation link.

3️⃣ Setup environment variables
Create .env files inside api/ and worker/ folders:

bash
Copy
Edit
AWS_REGION=ap-south-1
SQS_QUEUE_URL=https://sqs.ap-south-1.amazonaws.com/xxx/your-queue
SNS_TOPIC_ARN=arn:aws:sns:ap-south-1:xxx:your-topic
S3_BUCKET=your-s3-bucket
Replace with actual values from terraform output.

4️⃣ Install dependencies
bash
Copy
Edit
cd api
npm install
cd ../worker
npm install
5️⃣ Start services
In two separate terminals:

bash
Copy
Edit
cd api
npm start
bash
Copy
Edit
cd worker
npm start
6️⃣ Test with Postman
POST /order

json
Copy
Edit
{
  "orderId": "123",
  "amount": 200
}
POST /payment

json
Copy
Edit
{
  "paymentId": "abc",
  "status": "failed"
}
POST /notify

json
Copy
Edit
{
  "subject": "Hello",
  "message": "Manual test message"
}
