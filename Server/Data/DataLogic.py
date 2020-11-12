import boto3
import botocore
from boto3.dynamodb.conditions import Key
import face_recognition
import os
import logging


class suspectData():

    def __init__(self, userId, cameraId, name="none", reportDate="none"):
        self.dynamodb = boto3.resource('dynamodb', region_name ="ca-central-1" )
        self.suspectTable = "suspectTable"
        self.settingsTable = "settingsTable"
        self.s3 = boto3.resource('s3')
        self.bucketName = "suspectbucket"
        self.user = userId
        self.cameraId = cameraId
        self.name = name
        self.reportDate = reportDate
    


    def queryDataFromDynamoDB(self):
        
        logging.info(f"Initialing read to DB for {self.user}")
        table = self.dynamodb.Table(self.suspectTable)
        response = table.query(
            KeyConditionExpression=Key("userId").eq(self.user)
        )
        
        return response['Items']    

    def createEncodings(self):
        Items = self.queryDataFromDynamoDB()
        encodings =[]
        names =[]

        for item in Items:
            filename = item['objectKey'].split("/")[1]
            name = item['name']
            try:
                self.s3.Bucket(self.bucketName).download_file(item['objectKey'], f'./tmp/{filename}')
            except botocore.exceptions.ClientError as e:
                if e.response['Error']['Code'] == "404":
                    logging.warning("No Image found in bucket")
                else:
                    raise
        
            suspect_face = face_recognition.load_image_file(f'./tmp/{filename}')
            encodings.append(face_recognition.face_encodings(suspect_face)[0])
            names.append(name)
            os.remove(f'./tmp/{filename}')

        return encodings, names

    def getSettings(self):

        table = self.dynamodb.Table(self.settingsTable)
        response = table.query(
            ProjectionExpression="userId, cameraId, url_path, username, password, ip, port",
            KeyConditionExpression=Key("userId").eq(self.user) & Key("cameraId").eq(self.cameraId)
        )
        return response['Items']    

    def getServiceStatus(self):
        table = self.dynamodb.Table(self.settingsTable)
        response = table.query(
            ProjectionExpression="userId, cameraId, req_Status",
            KeyConditionExpression=Key("userId").eq(self.user) & Key("cameraId").eq(self.cameraId)
        )
        return response['Items']    
    
    def changeServerStatus(self,newStatus):
        table = self.dynamodb.Table(self.settingsTable)
        response = table.update_item(
            Key = {
                "userId": self.user,
                "cameraId": self.cameraId
                    },
            UpdateExpression=" set server_Status=:s",
            ExpressionAttributeValues={
                ":s": newStatus
            },
            ReturnValues = "UPDATED_NEW"
            
        )

    def getCameraLocation(self):
        table = self.dynamodb.Table(self.settingsTable)
        response = table.query(
            ProjectionExpression="userId, cameraId, cam_Location",
            KeyConditionExpression=Key("userId").eq(self.user) & Key("cameraId").eq(self.cameraId)
        )
        return response['Items'][0]["cam_Location"]    


    def reportFinding(self):
        location = self.getCameraLocation()
        findings = {"date":self.reportDate, "location":location }
        table = self.dynamodb.Table(self.suspectTable)
        response = table.update_item(
            Key = {
                "userId": self.user,
                "name": self.name
                    },
            UpdateExpression=" set findings= list_append(findings,:f)",
            ExpressionAttributeValues={
                ":f": [findings]
            },
            ReturnValues = "UPDATED_NEW"
            
        )


    # def getDataFileFromS3(self):
    #     #  ***************** Using Data files from S3 Bucket ********************************************
    #     logging.info("Initialing read files from bucket")
    #     #s3_client = boto3.client('s3')
    #     s3_resource = boto3.resource('s3')
    #     try:
    #         s3_resource.Bucket("suspectbucket").download_file("logic_faces.dat", './tmp/logic_faces.dat')
    #     except botocore.exceptions.ClientError as e:
    #         if e.response['Error']['Code'] == "404":
    #                 logging.warning("No logic_faces file found in bucket")
    #         else:
    #             raise
    #     try:
    #         s3_resource.Bucket("suspectbucket").download_file("logic_names.dat", './tmp/logic_names.dat')
    #     except botocore.exceptions.ClientError as e:
    #         if e.response['Error']['Code'] == "404":
    #                 logging.warning("No logic_names file found in bucket")
    #         else:
    #             raise
    #     try:
    #         s3_resource.Bucket("suspectbucket").download_file("settings.dat", './tmp/settings.dat')
    #     except botocore.exceptions.ClientError as e:
    #         if e.response['Error']['Code'] == "404":
    #                 logging.warning("No settings file found in bucket")
    #         else:
    #             raise
    #     known_face_encodings =load(open("./tmp/logic_faces.dat","rb"))
    #     known_face_names = load(open("./tmp/logic_names.dat","rb"))
    #     settings = load(open("./tmp/settings.dat","rb"))
    #     #******************************** End S3 ********************************************
    #     return known_face_encodings, known_face_names, settings

