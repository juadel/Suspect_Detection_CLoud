import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { SettingItem } from "../Models/settingModel";
// import { settingsRequestModel } from "../models/settingsRequestModel";

export class Sets 
{ constructor (
      private docClient: DocumentClient = createDynamoDBClient(),
      private settingsTable = process.env.SETTINGS_TABLE,
            
  ) {}
  

async createCamSets(camSet: SettingItem): Promise<SettingItem> {
    await this.docClient.put({
        TableName: this.settingsTable,
        Item: camSet
    })
    .promise();
  return camSet;
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


