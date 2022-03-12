import 'source-map-support/register';
import {generateUploadUrl} from '../../Business/suspectItems';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // TODO: Return a presigned URL to upload a file for a Suspect Image with the provided User id
  const uploadUrl = await generateUploadUrl(event);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({msg:"Signed URL created",
      uploadUrl
    })
  }
}
