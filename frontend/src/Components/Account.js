import React, { Component } from "react";
import styled from "styled-components";
import getToken from '../Config/getToken';
import { Button, Typography } from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Auth } from 'aws-amplify';
import Grid from '@material-ui/core/Grid';


const ButtonLocation = styled.div`
    
    padding-top: 20px;
    text-align: center;
    
`;

class Account extends Component {
    
    constructor(){
        super();
        this.state={
            token:"" , user:"", attributes: [], oldPassword:"", newPassword:"", rePassword:""
          };

    }
    async componentDidMount(){
        await this.handleAuth();
        
        
    }
    
    async handleAuth(){
      let token = new getToken();
      await token.token()
      this.setState({
          token: token.state.jwtToken,
          user: token.state.user,
          attributes: token.state.attributes
      })
    }

    handleFormInput = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name] : value })
    }
    
    handleSubmitChangePass = () => {
        if (this.state.oldPassword!==""){
            if(this.state.newPassword===this.state.rePassword){
                this.changePassword() 
            }
            else{
                alert("New Password does not match")
            }
        }
        else {
            alert("Old Password can not be empty")
        }

    }

    async changePassword(){
        await Auth.currentAuthenticatedUser()
        .then(user =>{
            return Auth.changePassword(user, this.state.oldPassword, this.state.newPassword );
        })
        .then(data => alert(data))
        .catch(err => alert(err))
        window.location.reload();
        
    }

    handleRoute = route =>() =>{
        this.props.history.push({pathname: route})
        
    }



    render(){
       
        return(
            <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                <Paper>
                    <Typography gutterBottom variant="h5" component="h5">Change Password</Typography>
                    
                    <TextField required id="standard-required-1" label="Old Password" type="password"  onChange={this.handleFormInput} name="oldPassword"/>
                    
                    <TextField required id="standard-required-1" label="New Password" type="password"  onChange={this.handleFormInput} name="newPassword"/>
                    <TextField required id="standard-required-1" label="Repeat new Password" type="password"  onChange={this.handleFormInput} name="rePassword"/>
                    
                </Paper>
                <ButtonLocation>
                    <Button variant="contained"  align="justify" onClick={this.handleSubmitChangePass}>change</Button>
                </ButtonLocation>
                </Grid>
                {/* <Paper>
                    <Typography variant="body2" color="textSecondary" component="p">Change email</Typography>
                </Paper>
                <Paper>
                    <Typography variant="body2" color="textSecondary" component="p">Change Phone</Typography>
                </Paper> */}
            </Grid>
        )
    }



}

export default Account