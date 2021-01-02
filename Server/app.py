from flask import Flask, Response, request
import logging
from Bussines.face_detector import FaceDetectorProcess
import os
from os import path
from threading import Thread


app = Flask(__name__)


def detectorServer(userId, cameraId):
    # Initizializin for first time:
    
    if not path.exists('./tmp'):
        os.mkdir(f"./tmp")
        logging.warning("Creating TMP folder")
    if not path.exists(f'./tmp/{userId}'):
        os.mkdir(f"./tmp/{userId}")
        logging.warning("Creating User folder")
    
    # creating detection process for specific user and camera    
    detection_process = FaceDetectorProcess(userId, cameraId)
    detection_process.start()

def createEncodings(userId):
    if not path.exists('./tmp'):
        os.mkdir(f"./tmp")
        logging.warning("Creating TMP folder")
    if not path.exists(f'./tmp/{userId}'):
        os.mkdir(f"./tmp/{userId}")
        logging.warning("Creating User folder")
        
    detection_process = FaceDetectorProcess(userId, cameraId="001")
    detection_process.createEncodings()


         
@app.route('/start/', methods=['GET'])
def start():
    # Start server mode
    userId = request.args.get('userId')
    cameraId = request.args.get('cameraId')
    
    thread = Thread(target=detectorServer, kwargs={'userId':userId,'cameraId':cameraId})
    thread.start()
    
    return (f"Streaming for camera {cameraId} has been requested")

@app.route('/encodings/', methods=['GET'])
def encodings():
    userId= request.args.get('userId')
    thread = Thread(target=createEncodings, kwargs={'userId':userId})
    thread.start()
    
    return (f"Encoding process initiated")

    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    #app.run()