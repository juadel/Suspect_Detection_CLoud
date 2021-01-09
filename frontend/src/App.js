
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
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
import Api from './Components/Api';
import Home from './Home';
import Cameras from './Components/Cameras';
import Suspects from './Components/Suspects';
import Dashboard from './Components/Dashboard';
import Account from './Components/Account';
import { CardHeader } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';




function App() {
  return (
    <BrowserRouter>
    <Switch>        
             <Route exact path="/home" component={Home}/>
             <Route exact path="/" component={Home} />
             <Route exact path="/api" component={Api} />
             <Route exact path="/suspects" component={Suspects}/>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/cameras" component={Cameras}/>
            <Route exact path="/account" component={Account}/>
          </Switch>
    </BrowserRouter>
    
  
  );
}

export default App;
