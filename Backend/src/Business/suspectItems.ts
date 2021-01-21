//import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../Lambda/utils";
import { Suspect } from "../Data/dataSuspects";
import { SuspectItem } from "../Models/suspectModel";
import { SuspectRequestItem} from "../Models/suspectRequestModel";
import { urlRequest} from "../Models/urlRequest";
import { ReportRequest } from "../Models/reportModel";
import { findingModel } from "../Models/findingsModel";

const suspect= new Suspect ();

export async function createSuspect( event: APIGatewayProxyEvent ): Promise<SuspectItem> {
    
    const userId = getUserId(event);
    
    const newSusp: SuspectRequestItem = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const createdSuspect = await suspect.createSuspect(
      { 
        userId: userId,
        findings: [],
        encoding: "N/A",
        encoding_status: "No Image",
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
    const suspectName = newRequestUrl.suspectName;
    const generatedUrl = await suspect.generateUploadUrl(userId, suspectName, filename);
    return generatedUrl
}

export async function sendNotification(event:APIGatewayProxyEvent): Promise<AWS.SNS.PublishResponse> {
 
  const newRequest: ReportRequest = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  
  const message :string = `${newRequest.suspectName} has been detected in ${newRequest.location} at ${newRequest.date} UTC time`
  const txt = await suspect.sendTxtNotification(message, newRequest.phone)

  return txt


}

export async function getFindings( event: APIGatewayProxyEvent ): Promise<findingModel[]> {

  const userId = getUserId(event);
  const name = event.pathParameters.name;

  const findingsRepor : findingModel[] = await suspect.getFindings(userId, name )
  return findingsRepor
  
}

export async function genEncodings( event: APIGatewayProxyEvent ): Promise<string> {

  const userId = getUserId(event);
  const endpoint = `http://${process.env.SERVER_ENDPOINT}/encodings?userId=${userId}`
    
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

export async function getSuspects(event: APIGatewayProxyEvent) : Promise<SuspectItem[]> {
  
  const userId = getUserId(event);
  const response = await suspect.getSuspects(userId)
  return response
}

export async function delSuspect (event:APIGatewayProxyEvent) {
  const userId = getUserId(event);
  const name = event.pathParameters.name;
  
  const objectKey = event.queryStringParameters.objectKey;
  console.log(objectKey)
  const deleteSuspect = await suspect.delSuspect(userId, name, objectKey)
  return deleteSuspect
}