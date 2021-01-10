import React, { Component } from "react";
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import getToken from '../Config/getToken';
import apiEndpoint from '../Config/Apibackend';
import { Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { DataGrid } from '@material-ui/data-grid';


const ContainerSuspects = styled.table`
    display: flex;
    height: 40vh;
    
    
`;

const ContainerSummary = styled.div`
    padding-left: 150px;
    padding-top: 20px;
    
    
`;

const SummaryPaper = styled.div`
    height: 10vh;
    weidth: 20vh;
`;

const CamerasStyled = styled.table`
    display: flex;
    height: 40vh;
    
`;

const StyledAvatar = styled(Avatar)`
    color: #432313;
    backgroundColor: #5469d4;
    width: 120px;
    height: 120px;
    


`;

class Dashboard extends Component {
    
    constructor(){
        super();
        this.state={
           list_cameras: null, list_suspects: null, token:"" , checkbox: "", selectedIds: [], reload :false, user:"", serviceStatus :"Online", 
           activeCams : 0 , noImages: false
          };
    }
  intervalId = 0;
  async componentDidMount(){
      await this.handleAuth();
      await this.getServiceStatus();
      await this.getCameras();
      await this.getSuspects();
      
      this.intervalId = setInterval(() => {this.reload()}, 60000);
        
  }

  componentWillUnmount(){
      clearInterval(this.intervalId)
  }

  async reload(){
      
      console.log("reloading")
      await this.getCameras();
  }

  async getServiceStatus(){
    await axios.get(apiEndpoint+'/check',{
      headers:
      { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
    })
    .then(res => {this.setState({serviceStatus : res.data.status})})
    .catch(e => {this.setState({serviceStatus: "Offline"}); console.log(e)})
  }
  
  async handleAuth(){
    let token = new getToken();
    await token.token()
    this.setState({
        token: token.state.jwtToken,
        user: token.state.user
    })

}

  async getCameras(){

    await axios.get(apiEndpoint+'/getcameras', 
        {headers: 
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
         }).then(res => {this.setState({list_cameras: res.data.item});
           })
      .catch(e => console.log(e))
  }

  async getSuspects(){   
    await axios.get(apiEndpoint+'/getsuspects', 
        {headers: 
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
         }).then(res => {this.setState({list_suspects: res.data.item});
           })
      .catch(e => console.log(e))
    
  }


  getLackofEncodings = () =>{
    let count = 0
    
    if (this.state.list_suspects!=null){
        
        const arraySuspects = this.state.list_suspects
        
    
        let no_encoded =  arraySuspects.filter(function(noEncoded){
          return noEncoded.encoding_status === "Image not Enconded";
        })
        
        count = Object.keys(no_encoded).length
      }
    return (
      <Avatar>{count}</Avatar>
    )
   
  }

  getLackofImages =() =>{
    let count = 0
    
    if (this.state.list_suspects!=null){
        
        const arraySuspects = this.state.list_suspects
        
    
        let no_image =  arraySuspects.filter(function(noEncoded){
          return noEncoded.encoding_status === "No Image";
        })
        
        count = Object.keys(no_image).length
        if (count>0){
          this.setState({
            noImages: true
          })
        }
      }
    return (
      <Avatar > {count} </Avatar>
    )
   
  }

  getCamerasOn = () =>{
    let count = 0
    if (this.state.list_cameras!=null){
      const arrayCams = this.state.list_cameras
      let onCameras = arrayCams.filter(function(camOn){
        return camOn.server_Status == "1";
      })
      count = Object.keys(onCameras).length;
            
      return(
        <Avatar> {count}</Avatar>
      )
    }
    


  }

  getCamerasError = () =>{
    let count = 0
    if (this.state.list_cameras!=null){
      const arrayCams = this.state.list_cameras
      let onCameras = arrayCams.filter(function(camOn){
        return camOn.server_info === "No stream available";
      })
      count = Object.keys(onCameras).length
      //console.log(count)
      return(
        <Avatar> {count}</Avatar>
      )
    }

  }

  handleEncodings =() =>{
    if (this.state.serviceStatus=="Offline"){
      alert("The System is Offline, please contact: juadel@hotmail.com")
    }
    else{
      let count = 0
      if (this.state.list_cameras!=null)
        {
          const arrayCams = this.state.list_cameras
          let onCameras = arrayCams.filter(function(camOn){
            return camOn.server_Status == "1";
          })
          count = Object.keys(onCameras).length
        }
      if (count > 0 ){
        alert("Please Stop all streaming before generating new encodings")
      }
      else{
        this.genEncodings();
      }
    }  
  }

  async genEncodings(){
    
    await axios.get(apiEndpoint+'/encodings', 
        {headers: 
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
         }).then(res => {console.log(res.data); alert("Encodings process has started")})
         .catch(e => {console.log(e); alert(e)})
    window.location.pathname = "/api";
  }

  
  handleRowSelect = (row) =>{
    console.log(this.state.selectedIds);
    let selection = row.rowIds;
    
    let tempArrayofCamIds = []
    selection.map((id) =>{
      
      tempArrayofCamIds.push(this.state.list_cameras[id].cameraId);
      })
    
    console.log(tempArrayofCamIds);
    this.setState({
      selectedIds : tempArrayofCamIds
    })
    console.log(this.state.selectedIds);
  }

  handleStartStreaming = () =>{
    if (this.state.serviceStatus=="Offline"){
      alert("The System is Offline, please contact: juadel@hotmail.com")
    }
    else{
      if(this.setState.noImages){
        alert("Please create a suspects profile and include an images.")
      }
      else{
        
          if (this.state.selectedIds.length === 0){
            alert("Please select a Camera")
          }
          else{
            console.log(this.state.selectedIds);
            let cams = this.state.selectedIds;
            cams.map((id) =>{
              this.startStreaming(id)
            })
          }
        }
    }

  }

 async startStreaming(id){
   
     await axios.post(apiEndpoint+"/start/"+id,{},
      {
          headers:
          { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`}
      }).then(res =>{this.setState({reload: true});alert("Streaming requested")})
      .catch(e => {alert(e); console.log(e)});
      
      window.location.pathname = "/api";
      
}
handleStopStreaming = () =>{
  if (this.state.serviceStatus=="Offline"){
    alert("The System is Offline, please contact: juadel@hotmail.com")
  }
  else{
    if (this.state.selectedIds.length === 0){
      alert("Please select a Camera")
    }
    else{
      console.log(this.state.selectedIds);
      let cams = this.state.selectedIds;
      cams.map((id) =>{
        this.stopStreaming(id)
    })
    }
  }
  

}

  async stopStreaming(id){
    await axios.post(apiEndpoint+"/stop/"+id,{},
      {
          headers:
          { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`}
      }).then(res =>{this.setState({reload: true});alert("Streaming stop requested")})
      .catch(e => {alert(e); console.log(e)});
      window.location.pathname = "/api";
  }

  handleReload =() => {
    //window.location.reload();
    this.getCameras();
    this.getSuspects();

  }

  
    render() {

    
      
      let serviceStatus = null
      if (this.state.serviceStatus === "Online"){
           
           serviceStatus =<Chip size="small" label="Online" color="primary" />
          }
      else {
            
            serviceStatus =<Chip size="small" label="Offline" color="secondary" /> 
            }
          
      
      let cameraList = [];
      let suspectList = [];
      
      
              

      if (this.state.list_suspects){
        let temp = this.state.list_suspects;
          let id = 0;
          temp.map((item) =>
              {item.id = id; 
              id = id+1})
          
          suspectList = temp;
         
      
        }

      
        
      let suspColumns =[
            {
            headerName: "Name",
            field: "suspectName",
            width: 180
            },
            {
            headerName: "Encoding Status",
            field: "encoding_status",
            width: 200
            }]
          
      if (this.state.list_cameras){
        let temp = this.state.list_cameras;
          let id = 0;
          temp.map((item) =>
              {item.id = id;
                if(item.server_Status === 0){
                  item.server = "Stopped"}
                else{
                  if(item.req_Status===true){
                    item.server = "Running"
                   
                  }else {
                    item.server ="Stopping" }
                }
                
                
                

              id = id+1})
          
          
              
              cameraList = temp;

          
        }
        let failedCameras = this.getCamerasError();
        let onCameras = this.getCamerasOn();
        let no_encoded = this.getLackofEncodings();
        let no_images = this.getLackofImages();
        
          
      
      let camColumns = [
        {field: "cam_Location", headerName : "Location" , width:120},
        {field: "server_info", headerName : "Camera Status" , width:400},
        {field: "server", headerName : "Server Status" , width:200}
      ]
      
      
          
          
     
      return (
       <Grid container spacing={4}>
         <Typography variant="body2" component="h2"  color="textSecondary" gutterBottom>
                  System Status:      {serviceStatus}
          </Typography>
        

         <Grid item xs={12}>
         <Paper >
                <Typography variant="h5" component="h2"  color="textSecondary" gutterBottom>
                  Summary
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>Active streaming </Typography>
                  <ContainerSummary > {onCameras} </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                  
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>Failed or No streaming </Typography>
                  <ContainerSummary>{failedCameras} </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>No Image Profiles</Typography>
                  <ContainerSummary>{no_images} </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>No Encoded Images</Typography>
                  <ContainerSummary> {no_encoded}  </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                </Grid>
                </Grid>
              </Paper> 
         </Grid>
         
         <Grid item xs={12} sm={7}>
              <Paper>
                <CamerasStyled>
                <DataGrid rows={cameraList} columns={camColumns} checkboxSelection onSelectionChange={this.handleRowSelect}/>
                </CamerasStyled>
              </Paper>
              <Typography component="body2"  color="textSecondary" gutterBottom>
                  Note: - It can take up to 3 minutes to stop the server and the streaming -  use the REFRESH button to reload the data.
              </Typography>
          </Grid> 
          <Grid item xs={12} sm={5}>
              <Paper>
                <ContainerSuspects>
                <DataGrid rows={suspectList} columns={suspColumns} />
                </ContainerSuspects>
              </Paper>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Button variant="contained"  align="justify" onClick={this.handleStartStreaming} >Start Streaming</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained"  align="justify" onClick={this.handleStopStreaming} >Stop Streaming</Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="contained"  align="justify" onClick={this.handleEncodings} >Generate Encodings</Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained"  align="justify" onClick={this.handleReload} >Refresh</Button>
          </Grid>
          
        </Grid>
        
        

        
        
        
        

      )
    }
}


export default Dashboard;