# Multi-Tenant Client Onboarding Automation

By Patrice Andala Opiyo

## 📌 Overview
This project automates the onboarding process for new clients in a multi-tenant SaaS platform. It provisions and configures essential AWS resources in an automated and scalable manner using AWS SAM and GitHub Actions.

---

## **📌 Architecture Explanation**

### **Solution Overview**
The system is built using AWS serverless services to achieve a scalable, cost-effective, and highly available onboarding solution.

### **AWS Services Used**
1. **Amazon DynamoDB** - A fully managed NoSQL database that stores client data in a multi-tenant model using a partition key (`tenantId`) and a sort key (`resourceType#resourceId`).
2. **AWS Lambda** - A serverless function (`OnboardingLambda`) that handles onboarding requests by processing client details and saving them to DynamoDB.
3. **Amazon API Gateway** - An API management service that exposes a `POST /onboard` endpoint to trigger the Lambda function.
4. **AWS IAM** - Provides authentication and authorization for Lambda execution, API Gateway, and DynamoDB access.
5. **AWS S3** - Used for storing deployment artifacts when deploying via AWS SAM.
6. **AWS SAM (Serverless Application Model)** - Automates infrastructure provisioning and deployment.
7. **GitHub Actions** - Automates the deployment process with a CI/CD pipeline.

### **How This Design Addresses Multitenancy & Automation**
- **Multi-Tenancy:** Each client is assigned a unique `tenantId`, ensuring data is logically separated while still stored in a shared DynamoDB table.
- **Automation:** AWS SAM enables infrastructure as code, while GitHub Actions deploys updates automatically on code changes.
- **Scalability:** Serverless architecture ensures that the system scales automatically based on the number of onboarding requests.

---

##  **📌 How This Project Meets the Assignment Requirements**

### **1. Infrastructure Provisioning**
-  **DynamoDB Table**: A table (`MultiTenantClients`) with a partition key (`tenantId`) and sort key (`resourceType#resourceId`) to segregate tenant data.
-  **AWS Lambda Function**: `OnboardingLambda` processes incoming client data and stores it in DynamoDB.
-  **API Gateway**: Exposes an endpoint (`POST /onboard`) to trigger the Lambda function.
-  **AWS SAM Template**: The `template.yml` file provisions all resources via AWS CloudFormation.

### **2. Onboarding Process Implementation**
-  **Accepts Client Details** (`clientName`, `clientPhone`, etc.)
-  **Generates a Unique Tenant ID** using `uuidv4()`
-  **Stores Client Data in DynamoDB** via AWS SDK v3 (`@aws-sdk/client-dynamodb`)

### **3. Error Handling & Logging**
-  **Handles missing fields** (`400 Bad Request` response)
-  **Catches unexpected errors** (`500 Internal Server Error` response)
-  **Logs all steps** (Lambda execution, DynamoDB transactions)

### **4. CI/CD Pipeline with GitHub Actions**
-  **Automates Deployment** when pushing to `main`
-  **Runs Tests with Jest** before deployment
-  **Uses GitHub Secrets** for AWS credentials

### **5. Unit Testing**
-  **Mocks AWS SDK calls** (prevents real API calls during testing)
-  **Tests successful onboarding (`200 OK`)**
-  **Tests missing field errors (`400 Bad Request`)**
-  **Tests DynamoDB failures (`500 Internal Server Error`)**

---

# 🚀 **Setup Guide**

## **1️⃣ Prerequisites**
-  **AWS CLI installed** ([Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html))
-  **AWS SAM CLI installed** ([Install Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html))
-  **Node.js 18+ installed** ([Download Node.js](https://nodejs.org/))
-  **GitHub Actions set up** (for CI/CD deployment)

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
- `AdministratorAccess` (or least privilege policies like `AWSLambdaFullAccess`, `AmazonS3FullAccess`, `AWSCloudFormationFullAccess`, `AmazonDynamoDBFullAccess`, `IAMFullAccess`, `AmazonAPIGatewayAdministrator`)

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

---

## **📌 Extension Discussion**
This project can be extended in several ways:
1. **Scaling to Hundreds of Clients**: DynamoDB supports auto-scaling, and Lambda can handle concurrent executions with provisioned concurrency.
2. **Integrating a Fully Featured Admin Dashboard**: An admin dashboard could be built using React/Angular to manage tenant onboarding.
3. **Adding Authentication**: AWS Cognito can be added to secure API Gateway endpoints.

---

Patrice Andala Opiyo
patriceandala@gmail.com