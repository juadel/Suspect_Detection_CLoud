import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId, getReportTo } from "../Lambda/utils";
import { SettingItem } from "../Models/settingModel";
import { Sets } from "../Data/dataSettings";
import { SettingsRequestItem } from "../Models/settingsRequestModel";
import { SettingsUpdateItem } from "../Models/settingsUpdateModel";

// import axios from 'axios';



const setting= new Sets();

export async function createCamSets( event: APIGatewayProxyEvent ): Promise<SettingItem> {
    const cameraId = uuid.v4();
    const userId = getUserId(event);
    const report_to = getReportTo(event);
    const newSet: SettingsRequestItem = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const createdCamera = await setting.createCamSets(
      { 
        userId: userId,
        cameraId: cameraId,
        req_Status: false,
        server_Status: 0,
        server_info: "Camera Created",
        report_to: report_to,
        ...newSet
      }
    );
  return createdCamera;
}

export async function startStreaming(event: APIGatewayProxyEvent ): Promise<string> {
    const userId = getUserId(event);
    const cameraId = event.pathParameters.cameraId;
    const endpoint = `http://${process.env.SERVER_ENDPOINT}/start?userId=${userId}&cameraId=${cameraId}`
    console.log(endpoint)
    const axios = require('axios');
    try{
      const response = await axios.get(endpoint);
      console.log("This is a response")
      return JSON.stringify(response.data) }
      catch (e) {
        console.log("This is an error")
        return JSON.stringify(e)
      }

}

export async function stopStreaming(event: APIGatewayProxyEvent ): Promise<boolean> {
  const userId = getUserId(event);
  const cameraId = event.pathParameters.cameraId;
  const response = await setting.stopStreaming(userId, cameraId);
  return response

}

export async function getCameras (event: APIGatewayProxyEvent): Promise<SettingItem[]> {
  const userId = getUserId(event);
  const response = await setting.getCameras(userId);
  return response

}

export async function delCamera (event:APIGatewayProxyEvent) {
  const userId = getUserId(event);
  const cameraId = event.pathParameters.cameraId;
  const deleteCamera = await setting.delCamera(userId, cameraId)
  return deleteCamera
}

export async function updateCamera(event:APIGatewayProxyEvent) {
  const userId = getUserId(event);
  const cameraId = event.pathParameters.cameraId;
  const updatedCamera : SettingsUpdateItem = JSON.parse(event.body);
  const updateCamera = await setting.updateCamera(userId, cameraId, updatedCamera)
  return updateCamera
}