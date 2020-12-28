import React, { Component } from "react";
import styled from "styled-components";
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DataTable from "react-data-table-component";
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import getToken from '../Config/getToken';
import apiEndpoint from '../Config/Apibackend';
import { CardActionArea, CardContent, Container, Typography } from "@material-ui/core";
import SortIcon from "@material-ui/icons/ArrowDownward";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Avatar from "@material-ui/core/Avatar";
import { DataGrid } from '@material-ui/data-grid';


const ContainerSuspects = styled.table`
    display: flex;
    height: 40vh;
    
    
`;

const ContainerSummary = styled.div`
    padding-left: 100px;
    padding-top: 20px;
    text-align: center;
    
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
           list_cameras: null, list_suspects: null, token:"" , checkbox: "", selectedIds: [], reload :false
          };
    }
  async componentDidMount(){
      await this.handleAuth();
      await this.getCameras();
      await this.getSuspects();
      
  }
  
  async handleAuth(){
    let token = new getToken();
    await token.token()
    this.setState({
        token: token.state.jwtToken
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
          return noEncoded.encoding_status == "Image not Enconded";
        })
        console.log(Object.keys(no_encoded).length)
        count = Object.keys(no_encoded).length
      }
    return (
      <p>{count}</p>
    )
   
  }

  getLackofImages =() =>{
    let count = 0
    
    if (this.state.list_suspects!=null){
        
        const arraySuspects = this.state.list_suspects
        
    
        let no_image =  arraySuspects.filter(function(noEncoded){
          return noEncoded.encoding_status == "No Image";
        })
        console.log(Object.keys(no_image).length)
        count = Object.keys(no_image).length
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
      count = Object.keys(onCameras).length
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
        return camOn.server_info == "No Camera stream available, check RTSP settings ";
      })
      count = Object.keys(onCameras).length
      return(
        <Avatar> {count}</Avatar>
      )
    }

  }

  handleEncodings =() =>{
      this.genEncodings();
  }

  async genEncodings(){
    console.log(this.state.token)
    await axios.get(apiEndpoint+'/encodings', 
        {headers: 
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
         }).then(res => {console.log(res.data); alert("Encodings process has started")})
         .catch(e => {console.log(e); alert(e)})
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
    if (this.state.selectedIds.length == 0){
      alert("Please select a Camera")
    }
    else{
      console.log(this.state.selectedIds);
      let cams = this.state.selectedIds;
      this.startStreaming(cams);
    }
   

  }

 async startStreaming(cams){
   //console.log(this.state.token)
     await cams.map(async (id) => {
       axios.post(apiEndpoint+"/start/"+id,
      {
          headers:
          { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`}
      }).then(res =>{this.setState({reload: true});alert("Streaming has been initialized")})
      .catch(e => {alert(e); console.log(e)});
      })
    //window.location.reload();
      
}
handleStopStreaming = () =>{
  if (this.state.selectedIds.length == 0){
    alert("Please select a Camera")
  }
  else{
    console.log(this.state.selectedIds);
    let cams = this.state.selectedIds;
    this.stopStreaming(cams);
  }
 

}

  async stopStreaming(cams){
    //console.log(this.state.token)
     await cams.map(async (id) => {
       axios.post(apiEndpoint+"/stop/"+id,
      {
          headers:
          { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.token}`}
      }).then(res =>{this.setState({reload: true});alert("Streaming has stopped")})
      .catch(e => {alert(e); console.log(e)});
      })
    //window.location.reload();
  }

  handleReload =() => {
    window.location.reload();

  }
 
 

    render() {
      let cameraList = [];
      let suspectList = [];
      
      let summaryColumns = [{headerName:"Cameras with active streaming", field: "active", width:150},{headerName:"Failed streaming cameras", field: "failed", width:150},
                            {headerName:"Profiles with No Image", field: "no_image", width:150},{headerName:"Profiles with no encoded Image", field: "no_encoded", width:150}]
              

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
            width: 200
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
              id = id+1})
          
          cameraList = temp;
          
        }
        let failedCameras = this.getCamerasError();
        let onCameras = this.getCamerasOn();
        let no_encoded = this.getLackofEncodings();
        let no_images = this.getLackofImages();
        let summary = [{"id":1, "active":onCameras, "failed":failedCameras, "no_images":no_images,"no_encoded":no_encoded}]
          
      
      let camColumns = [
        {field: "cam_Location", headerName : "Location" , width:180},
        {field: "server_info", headerName : "Server Information" , width:200},
        {field: "server_Status", headerName : "Status" , width:120}
      ]
      
        
          
          
     
      return (
       <Grid container spacing={3}>
         <Grid item xs={12}>
         <Paper >
                <Typography variant="h5" component="h2"  color="textSecondary" gutterBottom>
                  Summary
                </Typography>
                <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>Cameras active streaming </Typography>
                  <ContainerSummary ><StyledAvatar $withBorder> {onCameras}</StyledAvatar>  </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                  
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>Failed streaming cameras</Typography>
                  <ContainerSummary>{failedCameras} </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>Profiles with No Image</Typography>
                  <ContainerSummary>{no_images} </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper>
                  <SummaryPaper>
                  <Typography variant="h8" component="h3"  gutterBottom>Profiles no encoded Image</Typography>
                  <ContainerSummary><StyledAvatar> {no_encoded}</StyledAvatar>  </ContainerSummary>
                  </SummaryPaper>
                  </Paper>
                </Grid>
                </Grid>
              </Paper> 
         </Grid>
         <Grid item xs={12} sm={6}>
              <Paper>
                <CamerasStyled>
                <DataGrid rows={cameraList} columns={camColumns} checkboxSelection onSelectionChange={this.handleRowSelect}/>
                </CamerasStyled>
              </Paper>
          </Grid> 
          <Grid item xs={12} sm={6}>
              <Paper>
                <ContainerSuspects>
                <DataGrid rows={suspectList} columns={suspColumns} />
                </ContainerSuspects>
              </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" align="justify" onClick={this.handleStartStreaming} >Start Streaming</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" align="justify" onClick={this.handleStopStreaming} >Stop Streaming</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" align="justify" onClick={this.handleEncodings} >Generate Encodings</Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" align="justify" onClick={this.handleReload} >Reload Data</Button>
          </Grid>
          
        </Grid>
        

        
        
        
        

      )
    }
}


export default Dashboard;