
import './App.css';
import {BrowserRouter, Switch, Route, withRouter} from 'react-router-dom';

import Api from './Components/Api';
import Home from './Home';
import Cameras from './Components/Cameras';
import Suspects from './Components/Suspects';
import Dashboard from './Components/Dashboard';
import Account from './Components/Account';





function App() {
  return (
    <BrowserRouter>
    <Switch>        
            <Route exact path="/home" component={Home}/>
            <Route exact path="/" component={Home} />
            <Route exact path="/api" component={Api} />
            {/* <Route exact path="/suspects" component={Suspects}/>
            <Route exact path="/dashboard" component={Dashboard}/>
            <Route exact path="/cameras" component={Cameras}/>
            <Route exact path="/account" component={Account}/> */}
    </Switch>
    </BrowserRouter>
    
  
  );
}

export default App;
