sam build
sam deploy --stack-name multi-tenant-onboarding \
  --s3-bucket multi-tenant-sam-deployments \
  --region us-east-1 \
  --capabilities CAPABILITY_IAM