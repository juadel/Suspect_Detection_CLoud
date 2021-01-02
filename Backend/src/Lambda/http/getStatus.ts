import 'source-map-support/register';
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import {getStatus} from '../../Business/settingsItems';
export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  // Start a streaming from UserId and CameraId
  const status = await getStatus()

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
    body: JSON.stringify({msg:"Server Status",
      status
    })
  }
}
