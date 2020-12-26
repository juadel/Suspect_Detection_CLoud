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
import { Container } from "@material-ui/core";
import SortIcon from "@material-ui/icons/ArrowDownward";
import Card from '@material-ui/core/Card';

class Dashboard extends Component {
    
    constructor(){
        super();
        this.state={
           list_cameras: null, list_suspects: null, token:"" , checkbox: ""
          
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
          const isIndeterminate = indeterminate => indeterminate;
        
          const [checkbox1, setCheckbox1] = this.useState('');
          const showLogs2 = (e) => {
            setCheckbox1(e);
          };
     
      return (
        <Card>
        <DataTable highlightOnHover
          title="Suspects"
          columns = {suspColumns}
          data = {suspectList}
          defaultSortField="name"
          sortIcon={<SortIcon />}
          pagination
          checkbox
          headCheckboxID='id4'
          bodyCheckboxID='checkboxes4'
          selectableRows
          selectableRowsComponent={Checkbox}
          getValueCheckBox={(e) => {
            this.showLogs2(e);
          }}
          
          />
          

      </Card>
    
        

      )
    }
}


export default Dashboard;