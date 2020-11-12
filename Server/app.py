from flask import Flask, Response, request
import logging
from Bussines.face_detector import FaceDetectorProcess
import os
from os import path


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
    detectorServer(userId,cameraId)
    return "Server stopped"
   
    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    #app.run()