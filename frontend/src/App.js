import './App.css';
import React, { Component } from "react";
import {BrowserRouter, Switch, Route, Redirect, withRouter} from 'react-router-dom';
import Sidebar from './Sidebar';
import Cameras from './Components/Cameras'
import Suspects from './Components/Suspects'
import Dashboard from './Components/Dashboard'
import Account from './Components/Account'
import Menubar from './Components/MenuBar'
import Amplify from 'aws-amplify';
import Cognito from './Config/Cognito';
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';




Amplify.configure(Cognito);

class App extends Component {
  
  render(){
  return (
    
    <BrowserRouter>
    <Redirect path="/dashboard"/>
    
    <div className="App">
      <div class="container">
        <Sidebar class="grid-sidebar"/>
      
        <div class="header">  
        <Menubar/>
        
        </div>
        <div class="content">
        <Switch>
            
            
            <Route exact path="/suspects" component={Suspects}/>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/cameras" component={Cameras}/>
            <Route exact path="/account" component={Account}/>
            <Route exact path="/" component={Dashboard} />

            
            
            
          </Switch>
         
        </div>
      </div>
    </div>   
   
    </BrowserRouter>
  );
 }
}



export default withAuthenticator(App, false);
