
import './App.css';
import Typography from "@material-ui/core/Typography";
import Main from './components/main'

function App() {
  return (
    <div className="App">
      
      
        <div className="bg-text">
        <Typography variant="h1" component="h2"   gutterBottom>
          Suspect Detector App 
        </Typography>
        </div>
        <div className="useCases">
        <Typography variant="h5" component="h2"> Use Cases: </Typography>
        <Typography variant="body" color="inherit" component="p" align="justify">
                            
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>To crop an Image, use <a href="https://photoshop.adobe.com/" target="_blank" >Adobe Photoshop online</a> App.</li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                        
                        
         </Typography>
         </div>
         <div className="instructions">
         
        <Typography variant="h6"  component="p" align="justify">
                            <ol>
                            <li> Register </li>
                            <li> Set up an Ip Camera </li>
                            <li> Add suspects profiles you want to identify </li>
                            <li> Activate the camera streaming </li>
                            <li> You will recieve a Txt message on the number you used to register, notifying you when the suspect is detected by the camera </li>
                            <li> You can Stop/Start the streaming whenever it needs </li>
                            <li> Add multiple Suspects profiles and multiple Cameras </li>
                            </ol>
                        
                        
         </Typography>
         </div>
        
    </div>
  );
}

export default App;
