import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId, getReportTo } from "../Lambda/utils";
import { SettingItem } from "../Models/settingModel";
import { Sets } from "../Data/dataSettings";
import { SettingsRequestItem } from "../Models/settingsRequestModel";

import axios from 'axios';



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
    const cameraId = event.pathParameters.cameraid;
    const response :string = await axios.get(process.env.SERVER_ENDPOINT+'/start?userId='+userId+'&cameraId='+cameraId)
    return response

}

export async function stopStreaming(event: APIGatewayProxyEvent ): Promise<number> {
  const userId = getUserId(event);
  const cameraId = event.pathParameters.cameraid;
  const response = await setting.stopStreaming(userId, cameraId);
  return response

}

