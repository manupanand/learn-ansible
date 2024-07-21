import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import * as path from 'path';

export class MyCdkAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 3, // Default is all AZs in the region
    });

    // Create a security group
    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      description: 'Allow SSH and HTTP access',
      allowAllOutbound: true, // Allow all outbound traffic
    });

    // Allow SSH (port 22) and HTTP (port 80) access from anywhere
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'allow ssh access from the world');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'allow http access from the world');

    // Create an EC2 instance
    const ec2Instance = new ec2.Instance(this, 'MyInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      securityGroup,
      keyName: 'my-key-pair', // Change this to your key pair name
    });

    // Add user data to the instance
    ec2Instance.addUserData(
      `#!/bin/bash
      sudo yum update -y
      sudo yum install -y curl
      curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
      sudo yum install -y nodejs
      sudo npm install -g pm2
      mkdir /home/ec2-user/app
      cd /home/ec2-user/app
      echo 'const express = require("express"); const app = express(); app.get("/", (req, res) => res.send("Hello from Express!")); app.listen(80, () => console.log("Server running on port 80"));' > index.js
      npm install express
      pm2 start index.js
      pm2 startup
      pm2 save
      pm2 restart all
      `
    );

    // Add IAM role to the instance
    ec2Instance.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
  }
}

const app = new cdk.App();
new MyCdkAppStack(app, 'MyCdkAppStack');