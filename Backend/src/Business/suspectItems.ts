//import * as uuid from "uuid";
import { APIGatewayProxyEvent } from "aws-lambda";
import { getUserId } from "../Lambda/utils";
import { Suspect } from "../Data/dataSuspects";
import { SuspectItem } from "../Models/suspectModel";
import { SuspectRequestItem} from "../Models/suspectRequestModel";

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
    const filename = event.pathParameters.filename;
    const suspectName = event.pathParameters.suspectname;
    const userId = getUserId(event);
    const generatedUrl = await suspect.generateUploadUrl(userId, suspectName, filename);
    return generatedUrl
}
