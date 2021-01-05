
import './App.css';
import Typography from "@material-ui/core/Typography";
import ControlledAccordions from "./components/acordion";
import Card from "@material-ui/core/Card"
import Paper from "@material-ui/core/Paper"

function App() {
  return (
    
    <div className="container">
    
      
        <div className="side">
        <Typography  variant="h4" component="h2"   gutterBottom>
          Suspect Detector App 
        </Typography>
        </div>
        <div className="main">
          <Paper>
            <ControlledAccordions/>
          </Paper>
          
        
        <Typography variant="h5" component="h2"> Use Cases: </Typography>
        <Typography variant="body"  component="p" align="justify">
                            
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>To crop an Image, use <a href="https://photoshop.adobe.com/" target="_blank" >Adobe Photoshop online</a> App.</li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                            <li>For better detection and encoding results please use ID style images. </li>
                        
                        
         </Typography>

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
         <div>
        <Typography  variant="h4" component="h2"   gutterBottom>
            Suspect Detector App 
          </Typography>
        </div>
        
    </div>
    
  
  );
}

export default App;
