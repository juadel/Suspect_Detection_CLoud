from flask import Flask, Response, request
import logging
from Bussines.face_detector import FaceDetectorProcess
import os
from os import path
from threading import Thread


app = Flask(__name__)


def detectorServer (userId, cameraId):
    # Initizializin for first time:
    
    if not path.exists('./tmp'):
        os.mkdir("./tmp")
        logging.warning("Creating TMP folder")
    # creating detection process for specific user and camera    
    detection_process = FaceDetectorProcess(userId, cameraId)
    detection_process.start()
       
         
@app.route('/start/', methods=['GET'])
def start():
    # Start server mode
    userId = request.args.get('userId')
    cameraId = request.args.get('cameraId')
    
    thread = Thread(target=detectorServer, kwargs={'userId':userId,'cameraId':cameraId})
    thread.start()
    
    return (f"Streaming for camera {cameraId} has been requested")
   
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    #app.run()