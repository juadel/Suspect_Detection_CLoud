import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../Lambda/utils";
import { SettingItem } from "../Models/settingModel";
import { Sets } from "../Data/dataSettings";
import { SettingsRequestItem } from "../Models/settingsRequestModel";


const setting= new Sets();

export async function createCamSets( event: APIGatewayProxyEvent ): Promise<SettingItem> {
    const cameraId = uuid.v4();
    const userId = getUserId(event);
    const newSet: SettingsRequestItem = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const createdCamera = await setting.createCamSets(
      { 
        userId: userId,
        cameraId: cameraId,
        req_Status: false,
        server_Status: 0,
        server_info: "Camera Created",
        ...newSet
      }
    );
  return createdCamera;
}