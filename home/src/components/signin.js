import React, { Component } from "react";
import Amplify, { Auth } from 'aws-amplify';
import Grid from '@material-ui/core/Grid';
import Cognito from "../config/Cognito"
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import styled from "styled-components";

Amplify.configure(Cognito);

const User = styled.div`
    text-align: center;
    position: absolute;
    top: 89%;
    left: 42%;
    width: 7%;
    height: 5%;
    padding: 10px;
    border: 5px solid rgb(151, 148, 148);
    background-color : rgb(247, 239, 239);
    border-radius: 20px;
    
`;

const Pass = styled.div`
    
    text-align: center;
    position: absolute;
    top: 89%;
    left: 51%;
    width: 7%;
    height: 5%;
    padding: 10px;
    border: 5px solid rgb(151, 148, 148);
    background-color : rgb(247, 239, 239);
    border-radius: 20px;
`;

const ButtonStyled = styled.div`
    text-align: center;
    position: absolute;
    top: 93%;
    left: 60%;
    

`;

class Signin extends Component {

    constructor(){
        super();
        this.state={
            username:"", password:""
        }
    }

    


handleFormInput = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name] : value })
}

handleSignIn = () =>{

    this.signIn();
}

async  signIn() {
    
    try {
        const user = await Auth.signIn(this.state.username, this.state.password);
        console.log(user)
        // history.push("https://api.juadel.com");
    } catch (error) {
        console.log('error signing in', error);
    }
}


render(){
    return(
        <div>
            <User>
                <TextField required id="standard-required" label="username"  onChange={this.handleFormInput} name="username" />
            </User>
            <Pass>
            <TextField required
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        onChange={this.handleFormInput} name="password"
                        />
            </Pass>
            <ButtonStyled>
                <Button variant="contained"  onClick={this.handleSignIn} >Log In</Button>
            </ButtonStyled>
            
        
        </div>
        
    )
}


}

export default Signin