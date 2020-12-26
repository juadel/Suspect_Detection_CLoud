import './App.css';
import React, { Component } from "react";
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import Sidebar from './Sidebar';
import Cameras from './Components/Cameras'
import Suspects from './Components/Suspects'
import Dashboard from './Components/Dashboard'
import Settings from './Components/Settings'
import Amplify from 'aws-amplify';
import Cognito from './Config/Cognito';
import { withAuthenticator } from 'aws-amplify-react';
import Typography from '@material-ui/core/Typography';




Amplify.configure(Cognito);

class App extends Component {
  
  render(){
  return (
    <BrowserRouter>
    
    <div className="App">
      <div class="container">
        <Sidebar class="grid-sidebar"/>
      
        <div class="header">
        <Typography gutterBottom variant="h5" component="h2">Control Panel</Typography>
        </div>
        <div class="content">
          <Switch>
            
            <Route exact path="/cameras" component={Cameras}/>
            <Route exact path="/suspects" component={Suspects}/>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/settings" component={Settings}/>
          </Switch>
        </div>
      </div>
    </div>   
    </BrowserRouter>
  );
 }
}



export default withAuthenticator(App, false);
