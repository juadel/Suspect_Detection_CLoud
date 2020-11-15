import boto3
import botocore
from boto3.dynamodb.conditions import Key
import face_recognition
import os
import logging
from pickle import dump, load


class suspectData():

    def __init__(self, userId, cameraId):
        self.dynamodb = boto3.resource('dynamodb', region_name=os.environ['REGION'])
        self.suspectTable = os.environ("SUSPECT_TABLE")
        self.settingsTable = os.environ("SETTINGS_TABLE")
        self.s3 = boto3.resource('s3')
        self.bucketName = os.environ("BUCKET_NAME")
        self.user = userId
        self.cameraId = cameraId
            


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
        encodings_file={}
        for item in Items:
            filename = item['objectKey'].split("/")[1]
            name = item['name']
            #print(filename, name)
            try:
                self.s3.Bucket(self.bucketName).download_file(item['objectKey'], f'./tmp/{filename}')
            except botocore.exceptions.ClientError as e:
                if e.response['Error']['Code'] == "404":
                    logging.warning("No Image found in bucket")
                else:
                    raise
            #print(encodings)        
            suspect_face = face_recognition.load_image_file(f'./tmp/{filename}')
            face_encodings = face_recognition.face_encodings(suspect_face) 
            #print(face_encodings)
            if face_encodings==[]:
                logging.warning("Image is in wrong format")
                #encodings_file[name] = ([])
                
                #encodings.append(face_encodings) 
                self.updateSuspect(name,face_encodings, "Bad Encodings")
            else:
                #saving info to array
                encodings.append(face_encodings[0])
                names.append(name)
                #saving info to dictionary
                encodings_file[name]= face_encodings[0]
                # saving info to DB
                encodings_string = face_encodings[0].tostring()
                self.updateSuspect(name,encodings_string, "Good Encoding")
            os.remove(f'./tmp/{filename}')
            
       
        dump(encodings_file, open(f"./tmp/{self.user}/encodings.dat","wb"))
        try:
            self.s3.Bucket(self.bucketName).upload_file(f"./tmp/{self.user}/encodings.dat",f"{self.user}/encodings.dat")
        except botocore.exceptions.ClientError  as e:
            logging.error(e)
            return False
        
        return encodings, names
        
    def readEncodings(self):
        try :
            encodings_file=load(open(f"./tmp/{self.user}/encodings.dat","rb"))
            names = list(encodings_file.keys())
            encodings = list(encodings_file.values())
           
        except FileNotFoundError:
            print("no face encoding found")
            return self.createEncodings()
        
        return encodings, names




    def updateSuspect(self, name, encoding, encStatus):
        
        table = self.dynamodb.Table(self.suspectTable)
        response = table.update_item(
            Key = {
                "userId": self.user,
                "name": name
                    },
            UpdateExpression=" set encoding= :e, encoding_status= :s",
            ExpressionAttributeValues={
                ":e": encoding,
                ":s": encStatus
            },
            ReturnValues = "UPDATED_NEW"
            
        )



    def getSettings(self):

        table = self.dynamodb.Table(self.settingsTable)
        response = table.query(
            ProjectionExpression="url_path, username, password, ip, port",
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
    
    def changeServerStatus(self,newStatus, message):
        table = self.dynamodb.Table(self.settingsTable)
        response = table.update_item(
            Key = {
                "userId": self.user,
                "cameraId": self.cameraId
                    },
            UpdateExpression=" set server_Status=:s, server_info=:info",
            ExpressionAttributeValues={
                ":s": newStatus,
                ":info": message
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


    def reportFinding(self, name, reportDate):
        location = self.getCameraLocation()
        findings = {"date":reportDate, "location":location }
        table = self.dynamodb.Table(self.suspectTable)
        response = table.update_item(
            Key = {
                "userId": self.user,
                "name": name
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

