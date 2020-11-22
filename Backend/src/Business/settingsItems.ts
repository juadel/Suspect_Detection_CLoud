import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../lambda/utils";
import { SettingItem } from "../Models/settingModel";
import { Settings } from "../DataLogic/dataSettings";
import { SettingsRequestModel } from "../Models/settingsRequestModel";


const setting= new Settings();

export async function createTodo( event: APIGatewayProxyEvent ): Promise<SettingItem> {
    const cameraId = uuid.v4();
    const userId = getUserId(event);
    const newSet: SettingsRequestModel = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const createdCamera = await setting.createSets(
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