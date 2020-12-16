
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Sidebar from './Sidebar';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <div class="container">
        <Sidebar class="grid-sidebar"/>
        <div class="header">
          <p> Ops Suite</p> 
        </div>
        <div class="content"/>
      </div>
    </div>   
    </BrowserRouter>
  );
}

export default App;
