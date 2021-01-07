import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';



class Alerts extends Component {

    constructor(){
        super();
        this.state={
            close: false, open: true, suspect:"" , location:"", date:"", time:""

        };

    }
    intervalId = 0;
    namesList = ["Juan", "Caro", "Jaco", "Tomy", "Jhon Doe", "David Bowie", "Axel Rose", "Tino", "Andres"]
    locationList = ["Front Door", "Store 011", "Garage", "Cash Office", "Safe", "Back Door", "Staff Room", "Main Door"]
    componentDidMount= () =>{
        let SuspectName = this.namesList[Math.floor(Math.random()*this.namesList.length)];
        let locationName = this.locationList[Math.floor(Math.random()*this.locationList.length)];
        let localDate = new Date();
        this.setState({suspect: SuspectName, location:locationName, date:localDate.toLocaleDateString(), time:localDate.toLocaleTimeString()})
        this.intervalId = setInterval(() => {this.handleReload()}, 6000);
          
    }
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }

    handleReload =()=>{
        
        let SuspectName = this.namesList[Math.floor(Math.random()*this.namesList.length)];
        let locationName = this.locationList[Math.floor(Math.random()*this.locationList.length)];
        let localDate = new Date();
        this.setState({open:true, suspect: SuspectName, location:locationName, date:localDate.toLocaleDateString(), time:localDate.toLocaleTimeString()})
    }

    handleClose =()=>{
        this.setState({open:false})
    }

    render(){

        return(
            <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={this.state.open} autoHideDuration={3000} onClose={this.handleClose}>
            <Alert onClose={this.handleClose} severity="warning" >{this.state.suspect} has been detected in {this.state.location} at {this.state.date}, {this.state.time}!</Alert>
            </Snackbar>
        )
    }

}

export default Alerts;