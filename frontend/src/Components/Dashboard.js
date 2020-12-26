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


const ContainerSuspects = styled.div`
    display: flex;
    padding-top: 30px;
    padding-left: 10px;
    
`;

class Dashboard extends Component {
    
    constructor(){
        super();
        this.state={
           list_cameras: null, list_suspects: null, token:"" , checkbox: "", selected: "", reqEnconding: "", noImage:""

          
          };
    }
  async componentDidMount(){
      await this.handleAuth();
      await this.getCameras();
      await this.getSuspects();
      console.log(this.state.list_cameras)
      console.log(this.state.list_suspects)
      console.log(this.state.token)
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
      
      if (this.state.list_suspects)
        suspectList = this.state.list_suspects;
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
          
        
          
          
     
      return (
       <div>
        
        <Card>
        <DataTable highlightOnHover
          title="Suspects List"
          columns = {suspColumns}
          data = {suspectList}
          defaultSortField="name"
          sortIcon={<SortIcon />}
          pagination
          bodyCheckboxID='checkboxes1'
          selectableRows
          selectableRowsComponent={this.customCheckbox}
          />
        </Card>
        <Card padding-top="30px" padding-left="20px">
          <CardContent>
            <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>
              Sumary
            </Typography>
            <Typography variant="body2" component="p">
              Suspects requiring encoding : {this.state.reqEnconding}
            </Typography>
            <Typography variant="body2" component="p">
              Suspects with no Image: {this.state.noImage}
            </Typography>
          </CardContent>
          <CardActions>
          <Button variant="contained" color="primary"  >Generate Encodings</Button>


          </CardActions>
          
        </Card> 
        </div>
              
        

      )
    }
}


export default Dashboard;