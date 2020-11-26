import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { SuspectItem } from "../Models/suspectModel";
//import { suspectRequestModel } from "../models/suspectRequestModel";

export class Suspect 
{ constructor (
      private docClient: DocumentClient = createDynamoDBClient(),
      private S3 = createS3Bucket(),
      private suspectTable = process.env.SUSPECTS_TABLE,
      private bucket = process.env.SDC_BUCKET,
      private urlExp = process.env.SIGNED_EXPIRATION,
      
  ) {}
  

async createSuspect(suspect: SuspectItem): Promise<SuspectItem> {
    await this.docClient.put({
        TableName: this.suspectTable,
        Item: suspect
    })
    .promise();
  return suspect;
 }

async generateUploadUrl(userId: string, name: string, filename:string): Promise<string> {
  const objectKey = userId+"/"+filename
  const uploadUrl = this.S3.getSignedUrl("putObject", {
    Bucket: this.bucket,
    Key: objectKey,
    Expires: this.urlExp
  });
  await this.docClient.update({
      TableName: this.suspectTable,
      Key: { userId, name },
      UpdateExpression: "set objectKey=:URL",
      ExpressionAttributeValues: {
        ":URL": objectKey
    },
    ReturnValues: "UPDATED_NEW"
  })
  .promise();

return uploadUrl;
  }
}




function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log("Creating a local DynamoDB instance");
    return new XAWS.DynamoDB.DocumentClient({
        region: "localhost",
        endpoint: "http://localhost:8000"
    });
  }
  return new XAWS.DynamoDB.DocumentClient();
}

function createS3Bucket() {
    return new XAWS.S3({
      signatureVersion: "v4"
  });
}
