from flask import Flask, Response, request, render_template
import logging
from Bussines.face_detector import FaceDetectorProcess
import os
from os import path
from threading import Thread


app = Flask(__name__)

def gen_frames(userId, cameraId):   
    logging.warning(userId)
    detection_process = FaceDetectorProcess(userId, cameraId)
    #detection_process.start2()
    #detection_process.gen_streaming()

    


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
    #return 
    # logging.warning(detection_process.streaming)
    # return Response(detection_process.streaming, mimetype='multipart/x-mixed-replace; boundary=frame')

def createEncodings(userId):
    if not path.exists('./tmp'):
        os.mkdir(f"./tmp")
        logging.warning("Creating TMP folder")
    if not path.exists(f'./tmp/{userId}'):
        os.mkdir(f"./tmp/{userId}")
        logging.warning("Creating User folder")

    detection_process = FaceDetectorProcess(userId, cameraId="001")
    detection_process.createEncodings()

# @app.route('/')
# def index():
#     return render_template('index.html')
         
@app.route('/start', methods=['GET'])
def start():
    # Start server mode
    userId = request.args.get('userId')
    cameraId = request.args.get('cameraId')
    
    thread = Thread(target=detectorServer, kwargs={'userId':userId,'cameraId':cameraId})
    thread.start()
    
    return (f"Streaming for camera {cameraId} has been requested" )
    
    # return Response(detectorServer(userId, cameraId), mimetype='multipart/x-mixed-replace; boundary=frame')
    
@app.route('/video_feed',methods=['GET'])
def video_feed():
    userId = request.args.get('userId')
    logging.warning(userId)

    cameraId = request.args.get('cameraId')
   # stream = gen_frames(userId, cameraId)
    #video = Response(stream, mimetype='multipart/x-mixed-replace; boundary=frame')
    #return render_template('index.html', value=video )


@app.route('/encodings/', methods=['GET'])
def encodings():
    userId= request.args.get('userId')
    thread = Thread(target=createEncodings, kwargs={'userId':userId})
    thread.start()
    
    return (f"Encoding process initiated")

@app.route('/check/', methods=['GET'])
def check():
    return("Online")

    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
    #app.run()