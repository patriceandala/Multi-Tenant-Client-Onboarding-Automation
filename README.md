# Multi-Tenant Client Onboarding Automation

By Patrice Andala Opiyo

## 📌 Overview
This project is a **multi-tenant client onboarding system** built using **AWS Lambda, API Gateway, and DynamoDB**, deployed via **AWS SAM** and automated using **GitHub Actions CI/CD**.

## 🎯 How This Meets the Assignment Requirements

| Requirement | Implementation |
|------------|---------------|
| **1. Infrastructure Provisioning** | Uses AWS SAM (`template.yml`) to provision **DynamoDB, Lambda, API Gateway** |
| **2. Onboarding Process Implementation** | Lambda (`index.js`) receives client details, assigns a `tenantId`, and stores it in **DynamoDB** |
| **3. Error Handling & Logging** | Uses **try-catch** blocks for **400 (Bad Request) and 500 (Internal Server Error)**, with **CloudWatch logs** |
| **4. CI/CD Simulation** | **GitHub Actions (`deploy.yml`) automatically builds & deploys** on `git push` |
| **5. Documentation** | This README provides **setup & deployment instructions** |
| **6. Testing** | Jest unit tests (`test_onboarding.js`) mock AWS SDK, covering **success, missing fields, and DB failures** |

---

## 🚀 How to Set Up the Project
This guide helps you **set up the project from scratch**, deploy it to AWS, and test the API.

### **1️⃣ Prerequisites**
Before proceeding, make sure you have:
- **Node.js** (`v18.x` or later)
- **AWS CLI** (`aws configure` must be set up)
- **AWS SAM CLI** (`sam --version` should work)
- **GitHub Actions** (for CI/CD automation)

---

### **2️⃣ Clone the Repository**
```sh
git clone https://github.com/patriceandala/Multi-Tenant-Client-Onboarding-Automation.git
cd Multi-Tenant-Client-Onboarding-Automation
```

---

### **3️⃣ Create an S3 Bucket for AWS SAM Deployments**
```sh
aws s3 mb s3://multi-tenant-sam-deployments --region us-east-1
```
- Ensure **Object Ownership** is set to `ACLs Disabled`
- Ensure **Block Public Access** is **enabled**

---

### **4️⃣ Create IAM User & Set Permissions**
1. Go to **AWS Console → IAM → Users → Create User**
2. Name it **`github-actions-deploy`**
3. Attach Policies:
   - ✅ `AdministratorAccess` *(Full access)* **OR**
   - ✅ `AWSLambdaFullAccess`, `AmazonDynamoDBFullAccess`, `AmazonAPIGatewayAdministrator`, `AWSCloudFormationFullAccess`
4. Copy the **Access Key ID** and **Secret Access Key**

---

### **5️⃣ Configure GitHub Secrets**
1. Go to **GitHub Repository → Settings → Secrets → Actions**
2. Click **"New Repository Secret"**, then add:
   - **Name:** `AWS_ACCESS_KEY_ID` **→ Value:** *(Paste Access Key ID)*
   - **Name:** `AWS_SECRET_ACCESS_KEY` **→ Value:** *(Paste Secret Access Key)*

---

### **6️⃣ Deploy the Project**
Run the following:
```sh
sam build
sam deploy --stack-name multi-tenant-onboarding \
           --s3-bucket multi-tenant-sam-deployments \
           --capabilities CAPABILITY_IAM \
           --no-confirm-changeset
```
After deployment, **copy the API Gateway URL** from the output.

---

### **7️⃣ Test the API**
Use **Postman** or `curl` to make a **POST request**:
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

### **8️⃣ Run Unit Tests Locally**
```sh
npm install  # Install dependencies
npm test     # Run Jest tests
```
✅ **Expected Output:**
```
PASS  tests/test_onboarding.js
  ✓ should successfully onboard a new client
  ✓ should return a 400 error if clientName is missing
  ✓ should return a 500 error on database failure
```

---

### **9️⃣ Automate Deployment Using GitHub Actions**
Every push to `main` **triggers a GitHub Actions workflow** (`.github/workflows/deploy.yml`).

```sh
git add .
git commit -m "Updated onboarding logic"
git push origin main
```
✅ **This automatically builds and deploys your Lambda function.**

---

## **🎯 Next Steps & Enhancements**
🔹 **Extend Multi-Tenancy:** Add `tenantId` authentication with **AWS Cognito**.
🔹 **Admin Dashboard:** Integrate a frontend for managing tenants.
🔹 **Multi-Region Deployment:** Extend to multiple AWS regions.

---

## **📞 Need Help?**
If you face any issues, open an issue in the [GitHub repository](https://github.com/patriceandala/Multi-Tenant-Client-Onboarding-Automation/issues).

🚀 **Enjoy automated multi-tenant onboarding with AWS!** 🎉

