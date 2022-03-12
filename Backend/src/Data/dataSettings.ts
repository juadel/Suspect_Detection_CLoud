import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const XAWS = AWSXRay.captureAWS(AWS);

import { SettingItem } from "../Models/settingModel";
import { SettingsUpdateItem } from "../Models/settingsUpdateModel";
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

 async stopStreaming(userId: string, cameraId: string) : Promise<boolean>{
    await this.docClient.update({
      TableName: this.settingsTable,
      Key: { userId, cameraId },
      UpdateExpression: "set req_Status=:req",
      ExpressionAttributeValues: {
        ":req": false
    },
    ReturnValues: "UPDATED_NEW"
    }).promise()
    return false

 }

 async getCameras(userId: string) : Promise<SettingItem[]>{
  const result = await this.docClient.query({
    TableName: this.settingsTable,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
      }
    })
    .promise();
    const items = result.Items;
    return items as SettingItem[];
 }
 
 async delCamera(userId: string, cameraId: string){
   const deleteCamera = await this.docClient.delete({
     TableName: this.settingsTable,
     Key: {userId, cameraId}
   })
   .promise();
   return {Deleted: deleteCamera}
 } 

 async updateCamera(userId: string, cameraId: string, updatedCamera: SettingsUpdateItem){
    const updatedCam = await this.docClient.update({
      TableName: this.settingsTable,
      Key: { userId, cameraId },
      UpdateExpression: "set cam_Location=:cam_Location, port=:port, password=:password, username=:username, report_to=:report_to, ip=:ip, url_path=:url_path",
      ExpressionAttributeValues: {
        ":cam_Location": updatedCamera.cam_Location,
        ":port": updatedCamera.port,
        ":password": updatedCamera.password,
        ":username": updatedCamera.username,
        ":report_to": updatedCamera.report_to,
        ":ip": updatedCamera.ip,
        ":url_path": updatedCamera.url_path
    },
    ReturnValues: "UPDATED_NEW"
  })
    .promise();
    return { Updated: updatedCam };
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


