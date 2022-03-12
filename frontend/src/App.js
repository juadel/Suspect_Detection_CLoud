
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
            <Route exact path="/suspects" component={Api}/>
            <Route exact path="/dashboard" component={Api}/>
            <Route exact path="/cameras" component={Api}/>
            <Route exact path="/account" component={Api}/>
    </Switch>
    </BrowserRouter>
    
  
  );
}

export default App;
