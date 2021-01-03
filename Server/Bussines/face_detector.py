import face_recognition
import cv2
import numpy as np
import os
from pickle import load
from Data.DataLogic import suspectData
from multiprocessing import Process
from apscheduler.schedulers.background import BackgroundScheduler
import logging
from datetime import datetime, timedelta

class FaceDetectorProcess:

    def __init__(self, userId, cameraId):
        self.process = Process(target=self.run, args=())
        self.process.daemon = True
        self.showVideoVariable = False
        self.live = self.process.is_alive()
        self.stop_running = False
        self.suspectData =  suspectData(userId,cameraId)
        self.settings = self.suspectData.getSettings()
        self.encodings, self.names =self.suspectData.readEncodings()
        
    
    def start(self):
        self.process.start()
        self.process.join()
        self.live= self.process.is_alive()
    
    def stop(self):
        self.process.terminate()
        self.stop_running = True
        return

    
    def checkStatus(self):
        # reads from DynamoDB table attribute req_Status to check if user requested stoping the server
        
        check = self.suspectData.getServiceStatus()
        
        if not check[0]['req_Status']:
            logging.warning("Streamming will be terminated")
            self.stop_running = True
            # Update Server Status on Settings Table as (0) "Server Stopped"

            self.suspectData.changeServerStatus(0, "Streaming will terminate")
        return
            
    def reportFinding(self, name, report):
        # reportFind = suspectData(self.user, self.camera, name, report)
        self.suspectData.reportFinding(name, report)
        return
    
    
    def checkData(self):
        if self.settings==[] or self.names==[] or self.encodings ==[]:
            return False
        else: 
            return True 
    
    def createEncodings(self):
        self.suspectData.createEncodings()
        return

    
   
    def run(self):
        logging.warning("Starting streamming")
        
        # Initialize a timer
        sched = BackgroundScheduler(daemon=True)
        # check if user has request to stop server, every "seconds" , 
        sched.add_job(self.checkStatus,'interval', seconds =int(os.environ['TIME_TO_CHECK']))
        sched.start()

        # read Data for specific user and camera
        if self.checkData():
            username = self.settings[0]['username']
            password = self.settings[0]['password']
            ip = self.settings[0]["ip"]
            port = self.settings[0]["port"]
            URL = self.settings[0]["url_path"]
            
        else:
            sched.shutdown()
            logging.warning("User doesn't exists or Camera is not configured")
            return "Server stopped"
        
        video_capture = cv2.VideoCapture(f"rtsp://{username}:{password}@{ip}:{port}/{URL}")
        if not video_capture.isOpened():
            self.suspectData.changeServerStatus(0, "No stream available")
            logging.warning("No stream available, check RTSP settings")
            video_capture.release()
            sched.shutdown()
            return "Server stopped"
        else:
            self.suspectData.changeServerStatus(1, "Streaming")

        # Initialize detection variables
        face_locations = []
        face_encodings = []
        face_names = []
        process_this_frame = True
        log = {}
        # Face Detaction process, exits if self.stop_running is True
        logging.warning("Streamming")

        while not self.stop_running:
            
            

            # Grab a single frame of video
            ret, frame = video_capture.read()
            if ret == True:

                
                # Resize frame of video to 1/4 size for faster face recognition processing
                small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

                # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
                rgb_small_frame = small_frame[:, :, ::-1]

                # Only process every other frame of video to save time
                if process_this_frame:
                    # Find all the faces and face encodings in the current frame of video
                    face_locations = face_recognition.face_locations(rgb_small_frame)
                    face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

                    face_names = []
                    
                    for face_encoding in face_encodings:
                        # See if the face is a match for the known face(s)
                        matches = face_recognition.compare_faces(self.encodings, face_encoding)
                        name = "Unknown"

                        face_distances = face_recognition.face_distance(self.encodings, face_encoding)
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = self.names[best_match_index]
                            now = datetime.now()

                            if log.get(name) != None :
                                if abs(now - log[name])< timedelta(minutes=10):
                                    log[name] = now
                                    logging.warning("Suspect seen no more than 10 min ago")
                                else:
                                    logging.warning("Suspect Return to site")
                                    log[name]=now
                                    date = now.strftime("%m/%d/%y, %H:%M")
                                    self.reportFinding(name, date)
                            else:
                                #logger(name, self.settings["phone"])
                                logging.warning("Suspect seen")
                                log[name] = now
                                print(name)
                                date = now.strftime("%m/%d/%y, %H:%M")
                                self.reportFinding(name, date)
                            


                        face_names.append(name)
                        
                        # if cv2.waitKey(1) & 0xFF == ord('q'):
                        #     break
                        if self.stop_running:
                            break
                        
                    
                    
            process_this_frame = not process_this_frame

            if (self.showVideoVariable):
                # Display the results
                for (top, right, bottom, left), name in zip(face_locations, face_names):
                    # Scale back up face locations since the frame we detected in was scaled to 1/4 size
                    top *= 4
                    right *= 4
                    bottom *= 4
                    left *= 4

                    # Draw a box around the face
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

                    # Draw a label with a name below the face
                    cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
                    font = cv2.FONT_HERSHEY_DUPLEX
                    cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

                # Display the resulting image
                cv2.imshow('Video', frame)

                # Hit 'q' on the keyboard to quit!
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                # if self.stop_running:
                #         break

        # Release handle to the webcam
        video_capture.release()
        cv2.destroyAllWindows()
        sched.shutdown()
        logging.warning("Streamming terminated")
        self.suspectData.changeServerStatus(0, "streamming terminated")
        return "Server stopped"