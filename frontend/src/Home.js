
import './App.css';
import React, { Component } from "react";
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import ControlledAccordions from "./Components/Acordion";
import Card from "@material-ui/core/Card"
import MuiAlert from "@material-ui/lab/Alert"
import VideocamIcon from '@material-ui/icons/Videocam';
import AccessAlarmsIcon from '@material-ui/icons/AccessAlarms';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import Chip from '@material-ui/core/Chip';
import Paper from "@material-ui/core/Paper";
import Alert from '@material-ui/lab/Alert';
import Alerts from './Components/Alerts';
import Signin from './Components/Signin';

import { CardHeader } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import getToken from './Config/getToken';








class Home extends Component {
 
  async handleAuth(){
    let token = new getToken();
    await token.token();
    console.log(token.state.attributes)
    if (token.state.attributes!=null){
      
        window.location.pathname = "/api";
        
      }
    }
 
  
 render() {
  let rerout = this.handleAuth();
  return (
    
    // <BrowserRouter>
      <div className="container2">
      <rerout/>
      
        <div className="side">
          <div className="title-side">
              <Typography  variant="body" component="h2"   gutterBottom>
              Detect known persons using conventional IP Cameras
              </Typography>
          </div>

          <div className="subtitle">
              <Typography  variant="body" component="h2"   >
              This application will detect people's faces and notify you when someone on your profile is seen.
              </Typography>
          </div>
          <div className="chips-list">
            <div className="chips-list-item"> 
              <div className="chips"> <Chip icon={<VideocamIcon/>} label="Live Streaming"/></div>
            </div>
            <div className="chips-list-item"> 
              <div className="chips"> <Chip icon={<AccessAlarmsIcon/>} label="Real Time Notifications"/></div>
            </div>
            <div className="chips-list-item"> 
              <div className="chips"> <Chip icon={<VerifiedUserIcon/>} label="Secure and Private"/></div>
            </div>
            <div className="chips-list-item"> 
              <div className="chips"> <Chip icon={<FilterDramaIcon/>} label="100% Coud Service"/></div>
            </div>
          </div>
          
          <div className="warning2">
            <Alerts/>
          </div>
          <div >
            <div className="acordion">
              <Card >
                <CardHeader avatar={<BuildIcon/>}  title="Instructions" />
                <ControlledAccordions/>
              </Card>
            </div>
          </div>
        </div>  
        <div className="main">
          <div className="title">
            <Typography  variant="body" component="h2"   gutterBottom>
            Use any IP camera for face recognition
            </Typography>
          </div>
          <div>
            <Signin/>  
          </div>
          <div className="footer">
            <Typography  variant="body" component="h2"   gutterBottom>
              <a href="https://www.juadel.com"> juadel.com - 2021 </a> 
            </Typography>
          </div>
        </div>
      
      </div>
   

    
    
  
    );
  }
}

export default withRouter(Home);
