import './App.css';
import React, { Component } from "react";
import {BrowserRouter, Switch, withRouter, Route, Redirect} from 'react-router-dom';
import Sidebar from '../Sidebar';
import Cameras from './Cameras';
import Suspects from './Suspects';
import Dashboard from './Dashboard';
import Account from './Account';
import Menubar from './MenuBar';
import Amplify from 'aws-amplify';
import Cognito from '../Config/Cognito';
import { withAuthenticator } from 'aws-amplify-react';
import '@aws-amplify/ui/dist/style.css';





Amplify.configure(Cognito);

const signUpConfig =
{header: 'Welcome to SDC',
hideAllDefaults: false,
defaultCountryCode: '1',
signUpFields: [
  {
    label: 'Name',
    key: 'name',
    required: true,
    displayOrder: 1,
    type: 'string'
  },
  
  

  // and other custom attributes
]
};

class Api extends Component {
  
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



export default withAuthenticator(Api);
