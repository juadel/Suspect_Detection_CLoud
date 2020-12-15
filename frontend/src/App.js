import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from 'react-router-dom';
import Sidebar from './Sidebar';

function App() {
  return (
    <BrowserRouter>
      <Sidebar/>   
    </BrowserRouter>
  );
}

export default App;
