import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Sidebar from './Sidebar';
import Cameras from './Components/Cameras'
import Suspects from './Components/Suspects'
import Dash from './Components/Dashboard'
import Settings from './Components/Settings'
import Amplify from 'aws-amplify';
import Cognito from './Config/Cognito';
import { withAuthenticator } from 'aws-amplify-react';




Amplify.configure(Cognito);

function App() {
  
  return (
    <BrowserRouter>
    <div className="App">
      <div class="container">
        <Sidebar class="grid-sidebar"/>
      
        <div class="header">
          <p> Ops Suite</p> 
        </div>
        <div class="content">
          <Switch>
            <Route exact path="/cameras" component={Cameras}/>
            <Route exact path="/suspects" component={Suspects}/>
            <Route exact path="/dash" component={Dash}/>
            <Route exact path="/settings" component={Settings}/>
          </Switch>
        </div>
      </div>
    </div>   
    </BrowserRouter>
  );
}



export default withAuthenticator(App, false);
