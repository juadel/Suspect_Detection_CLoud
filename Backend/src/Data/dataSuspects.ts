import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { suspectModel } from "../models/suspectModel";
import { suspectRequestModel } from "../models/suspectRequestModel";

export class Suspect 
{ constructor (
      private docClient: DocumentClient = createDynamoDBClient(),
      private S3 = createS3Bucket(),
      private suspectTable = process.env.SUSPECT_TABLE,
      private bucket = process.env.SDC_BUCKET,
      private urlExp = process.env.SIGNED_EXPIRATION,
      
  ) {}
  

async createSets(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
    })
    .promise();
  return todo;
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
