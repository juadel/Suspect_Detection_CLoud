import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { SuspectItem } from "../Models/suspectModel";
import { findingModel } from "../Models/findingsModel";

//import { suspectRequestModel } from "../models/suspectRequestModel";

export class Suspect 
{ constructor (
      private docClient: DocumentClient = createDynamoDBClient(),
      private S3 = createS3Bucket(),
      private suspectTable = process.env.SUSPECTS_TABLE,
      private bucket = process.env.SDC_BUCKET,
      private urlExp = process.env.SIGNED_EXPIRATION,
      private SNS = createSNS()
      
  ) {}
  

async createSuspect(suspect: SuspectItem): Promise<SuspectItem> {
    await this.docClient.put({
        TableName: this.suspectTable,
        Item: suspect
    })
    .promise();
  return suspect;
 }

async generateUploadUrl(userId: string, suspectName: string, filename:string): Promise<string> {
  const objectKey = userId+"/"+filename
  const uploadUrl = this.S3.getSignedUrl("putObject", {
    Bucket: this.bucket,
    Key: objectKey,
    Expires: this.urlExp
  });
  await this.docClient.update({
      TableName: this.suspectTable,
      Key: { userId, suspectName },
      UpdateExpression: "set objectKey=:URL",
      ExpressionAttributeValues: {
        ":URL": objectKey
    },
    ReturnValues: "UPDATED_NEW"
  })
  .promise();

return uploadUrl;
  }

async sendTxtNotification(message: string, phone: string) :Promise<AWS.SNS.PublishResponse>{
  const params = {
    Message: message,
    PhoneNumber: phone
  }
  const txt = await this.SNS.publish(params).promise();
  return txt 

  }

async getFindings(userId : string, name:string) :Promise<findingModel[]>{
  console.log(`get all Findings of ${name}`);
  const name_with_space =decodeURI(name)
  const result = await this.docClient.query({
        TableName: this.suspectTable,
        KeyConditionExpression: "userId = :userId and suspectName = :name ",
        ProjectionExpression: 'findings', 
        ExpressionAttributeValues: {
          ":userId": userId,
          ":name" : name_with_space
        }
    })
    .promise();
   
  const items = result.Items;
  console.log(result) 
  return items as findingModel[];
 }

 async getSuspects(userId: string) : Promise<SuspectItem[]> {
    const result = await this.docClient.query({
    TableName: this.suspectTable,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
      }
    })
    .promise();
    const items = result.Items;
    return items as SuspectItem[];
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

function createSNS() {
  return new XAWS.SNS({
    apiVersion: '2010-03-31'
});
}