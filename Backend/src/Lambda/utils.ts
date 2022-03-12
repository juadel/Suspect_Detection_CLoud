import { APIGatewayProxyEvent } from "aws-lambda";
import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  return parseUserId(jwtToken)
}

export function getReportTo(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  return parseUserPhone(jwtToken)
}


/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
function parseUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  console.log(decodedJwt)
  return decodedJwt.sub
}

function parseUserPhone(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  console.log(decodedJwt)
  return decodedJwt.phone_number
}

function parseUserEmail(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  console.log(decodedJwt)
  return decodedJwt.email
}

function parseUserName(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  console.log(decodedJwt)
  return decodedJwt.name
}