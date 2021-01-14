from flask import Flask, Response, request, render_template
import logging
from Bussines.face_detector import FaceDetectorProcess
import os
from os import path
from threading import Thread, current_thread
import cv2


app = Flask(__name__)

def gen_frames():   
   
    try: 
        video_capture = cv2.VideoCapture(f"rtsp://admin:juancho8@192.168.2.30:554/Streaming/Channels/101")
        while True:
            success, frame = video_capture.read()  # read the camera frame
            if not success:
                break
            else:
                (ret, buffer) = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    except cv2.error as e:
        logging.warning("No Stream available", e)

    


def detectorServer(userId, cameraId):
    # Initizializin for first time:
    
    if not path.exists('./tmp'):
        os.mkdir(f"./tmp")
        logging.warning("Creating TMP folder")
    if not path.exists(f'./tmp/{userId}'):
        os.mkdir(f"./tmp/{userId}")
        logging.warning("Creating User folder")
    
    
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

@app.route('/')
def index():
    
    return render_template('index.html')
         
@app.route('/start', methods=['GET'])
def start():
    # Start server mode
    userId = request.args.get('userId')
    cameraId = request.args.get('cameraId')
    
    thread = Thread(target=detectorServer, kwargs={'userId':userId,'cameraId':cameraId})
    thread.start()
    
    #streami = Response(video, mimetype='multipart/x-mixed-replace; boundary=frame')
    #return render_template('index.html', value=detectorServer(userId,cameraId), mimetype='multipart/x-mixed-replace; boundary=frame')
    return (f"Streaming for camera {cameraId} has been requested" )
    #return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    # return Response(detectorServer(userId, cameraId), mimetype='multipart/x-mixed-replace; boundary=frame')
    
@app.route('/video_feed',methods=['GET'])
def video_feed():
    # userId = request.args.get('userId')
    

    # cameraId = request.args.get('cameraId')
    
    # thread = Thread(target=gen_frames, kwargs={'userId':userId,'cameraId':cameraId})
    # thread.start()
    #video = gen_frames(userId,cameraId)
    print(Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame'))
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    #return "ok"


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
    app.run(host='0.0.0.0', port=5002, debug=True)
    #app.run()