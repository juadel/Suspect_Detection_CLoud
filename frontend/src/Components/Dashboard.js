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


const ContainerSuspects = styled.div`
    display: flex;
    padding-top: 10px;
    padding-left: 10px;
    
`;

const ContainerSummary = styled.div`
    padding-left: 20px;
`;




class Dashboard extends Component {
    
    constructor(){
        super();
        this.state={
           list_cameras: null, list_suspects: null, token:"" , checkbox: "", selected: ""
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
      <Avatar> {count} </Avatar>
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
      <Avatar> {count} </Avatar>
    )
   
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


  handleRowSelect(row){
    console.log(row)
  }

  customCheckbox = () =>{
    return(
         <Checkbox onClick={this.handleRowSelect} value="id"/>

    )
  }

 

    render() {
      let cameraList = [];
      let suspectList = [];
      
      if (this.state.list_suspects){
        suspectList = this.state.list_suspects;
      }
      let no_encoded = this.getLackofEncodings();
      let no_images = this.getLackofImages();
        
      let suspColumns =[
            {
            name: "Name",
            selector: "suspectName",
            sortable: true
            },
            {
            name: "Encoding Status",
            selector: "encoding_status",
            sortable: true
            }]
          
      if (this.state.list_cameras){
        let temp = this.state.list_cameras;
          let id = 0;
          temp.map((item) =>
              {item.id = id; 
              id = id+1})
          console.log(temp)
          cameraList = temp;
          
        }

      
      let camColumns = [
        {field: "cam_Location", headerName : "Location" , width:120},
        {field: "server_info", headerName : "Server Information" , width:200},
        {field: "server_Status", headerName : "Status" , width:120}
      ]
      
        
          
          
     
      return (
        <div>
       <ContainerSuspects>
        
        <Card>
        <DataTable highlightOnHover
          title="Profile List"
          columns = {suspColumns}
          data = {suspectList}
          defaultSortField="name"
          sortIcon={<SortIcon />}
          pagination
          bodyCheckboxID='checkboxes1'
          
          />
        </Card>
        
        <ContainerSummary>
        <Card >
          <CardContent>
            <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
              Sumary
            </Typography>
            <Typography variant="body2" component="p" align="justify">
              Profiles requiring encoding :
            </Typography>
            
              {no_encoded} 
            
            <Typography variant="body2" component="p" align="justify">
              Profiles with no Image: 
            </Typography>
             {no_images}
          </CardContent>
          <CardActions>
          
          <Button variant="contained" color="primary" align="justify" onClick={this.handleEncodings} >Generate Encodings</Button>
          

          </CardActions>
          
        </Card> 
        </ContainerSummary>
        </ContainerSuspects>
        
        
        
        
        <DataGrid rows={cameraList} columns={camColumns} checkboxSelection/>
              
        </div>

      )
    }
}


export default Dashboard;