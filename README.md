# Multi-Tenant Client Onboarding Automation

By Patrice Andala Opiyo

## 📌 Overview
This project automates the onboarding process for new clients in a multi-tenant SaaS platform. It provisions and configures essential AWS resources in an automated and scalable manner using AWS SAM and GitHub Actions.

---

## ✅ How This Project Meets the Assignment Requirements

### **1. Infrastructure Provisioning**
- ✅ **DynamoDB Table**: A table (`MultiTenantClients`) with a partition key (`tenantId`) and sort key (`resourceType#resourceId`) to segregate tenant data.
- ✅ **AWS Lambda Function**: `OnboardingLambda` processes incoming client data and stores it in DynamoDB.
- ✅ **API Gateway**: Exposes an endpoint (`POST /onboard`) to trigger the Lambda function.
- ✅ **AWS SAM Template**: The `template.yml` file provisions all resources via AWS CloudFormation.

### **2. Onboarding Process Implementation**
- ✅ **Accepts Client Details** (`clientName`, `clientPhone`, etc.)
- ✅ **Generates a Unique Tenant ID** using `uuidv4()`
- ✅ **Stores Client Data in DynamoDB** via AWS SDK v3 (`@aws-sdk/client-dynamodb`)

### **3. Error Handling & Logging**
- ✅ **Handles missing fields** (`400 Bad Request` response)
- ✅ **Catches unexpected errors** (`500 Internal Server Error` response)
- ✅ **Logs all steps** (Lambda execution, DynamoDB transactions)

### **4. CI/CD Pipeline with GitHub Actions**
- ✅ **Automates Deployment** when pushing to `main`
- ✅ **Runs Tests with Jest** before deployment
- ✅ **Uses GitHub Secrets** for AWS credentials

### **5. Unit Testing**
- ✅ **Mocks AWS SDK calls** (prevents real API calls during testing)
- ✅ **Tests successful onboarding (`200 OK`)**
- ✅ **Tests missing field errors (`400 Bad Request`)**
- ✅ **Tests DynamoDB failures (`500 Internal Server Error`)**

---

# 🚀 **Setup Guide**

## **1️⃣ Prerequisites**
- ✅ **AWS CLI installed** ([Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
- ✅ **AWS SAM CLI installed** ([Install Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
- ✅ **Node.js 18+ installed** ([Download Node.js](https://nodejs.org/))
- ✅ **GitHub Actions set up** (for CI/CD deployment)

---

## **2️⃣ Clone the Repository**
```sh
 git clone https://github.com/your-username/Multi-Tenant-Client-Onboarding-Automation.git
 cd Multi-Tenant-Client-Onboarding-Automation
```

---

## **3️⃣ AWS Setup**

### **1. Create an S3 Bucket** (For SAM Deployment Artifacts)
```sh
aws s3 mb s3://multi-tenant-sam-deployments
```

### **2. Create IAM Role for Lambda Execution**
#### **(Option 1: AWS Console)**
1. Go to **AWS IAM** → **Roles** → **Create Role**
2. Select **AWS Service** → **Lambda**
3. Attach policies:
   - `AmazonDynamoDBFullAccess`
   - `AWSLambdaBasicExecutionRole`
4. Name the role: `LambdaExecutionRole`
5. Copy the **Role ARN** for later use

#### **(Option 2: AWS CLI)**
```sh
aws iam create-role --role-name LambdaExecutionRole \
--assume-role-policy-document file://trust-policy.json
```
_(Define `trust-policy.json` as a file allowing Lambda to assume this role)_

---

### **3. Create IAM User for GitHub Actions**
```sh
aws iam create-user --user-name github-actions-deploy
```
Attach these policies:
- `AdministratorAccess` (or least privilege policies like `AWSLambdaFullAccess`, `AmazonS3FullAccess`, `AWSCloudFormationFullAccess`, `AmazonDynamoDBFullAccess`)

Generate access keys for the user:
```sh
aws iam create-access-key --user-name github-actions-deploy
```
Copy the **Access Key ID** and **Secret Access Key** for later.

---

## **4️⃣ Add AWS Credentials to GitHub Actions**
Go to **GitHub Repo** → **Settings** → **Secrets and Variables** → **Actions**.

Add the following secrets:
- `AWS_ACCESS_KEY_ID` → *(Paste Access Key ID)*
- `AWS_SECRET_ACCESS_KEY` → *(Paste Secret Access Key)*

---

## **5️⃣ Deploy the Project to AWS**

### **1. Install Dependencies**
```sh
npm install
```

### **2. Build and Deploy with AWS SAM**
```sh
sam build
sam deploy --stack-name multi-tenant-onboarding \
  --s3-bucket multi-tenant-sam-deployments \
  --capabilities CAPABILITY_IAM
```

✅ **After deployment, AWS will print an API Gateway URL** like:
```
https://your-api-id.execute-api.us-east-1.amazonaws.com/Prod/onboard/
```

---

## **6️⃣ Test the API**
### **Make a POST request to onboard a new client**
```sh
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/Prod/onboard/ \
  -H "Content-Type: application/json" \
  -d '{"clientName": "Acme Corp", "clientPhone": "+1234567890"}'
```

✅ **Expected Response:**
```json
{
  "message": "Client onboarded successfully",
  "tenantId": "a1b2c3d4-e5f6-7890-ghij-klmnopqrst"
}
```

---

## **7️⃣ Run Local Tests**
```sh
  npm test
```
✅ Ensures the Lambda function is working correctly!

---

# 🎉 **Congratulations! You’ve Successfully Set Up the Multi-Tenant Client Onboarding System!**
🚀 Let me know if you need any further improvements or additional features!

