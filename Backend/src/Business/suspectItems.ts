//import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../Lambda/utils";
import { Suspect } from "../Data/dataSuspects";
import { SuspectItem } from "../Models/suspectModel";
import { SuspectRequestItem} from "../Models/suspectRequestModel";
import { urlRequest} from "../Models/urlRequest";
import { ReportRequest } from "../Models/reportModel";

const suspect= new Suspect ();

export async function createSuspect( event: APIGatewayProxyEvent ): Promise<SuspectItem> {
    
    const userId = getUserId(event);
    
    const newSusp: SuspectRequestItem = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const createdSuspect = await suspect.createSuspect(
      { 
        userId: userId,
        findings: [],
        encoding: "N/A",
        encoding_status: "Pending to Encode",
        objectKey: userId+"/", 
        ...newSusp
      }
    );
  return createdSuspect;
}

export async function generateUploadUrl( event: APIGatewayProxyEvent ): Promise<string> {
    const newRequestUrl: urlRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const userId = getUserId(event);
    const filename = newRequestUrl.filename;
    const suspectName = newRequestUrl.name;
    const generatedUrl = await suspect.generateUploadUrl(userId, suspectName, filename);
    return generatedUrl
}

export async function sendNotification(event:APIGatewayProxyEvent): Promise<AWS.SNS.PublishResponse> {
 
  const newRequest: ReportRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  
  const message :string = `${newRequest.name} has been detected in ${newRequest.location} at ${newRequest.date} UTC time`
  const txt = await suspect.sendTxtNotification(message, newRequest.phone)

  return txt


}