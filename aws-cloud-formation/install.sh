npm install -g aws-cdk
mkdir my-cdk-app
cd my-cdk-app
cdk init app --language typescript
npm install @aws-cdk/aws-ec2 @aws-cdk/aws-iam @aws-cdk/aws-s3-assets
cdk deploy