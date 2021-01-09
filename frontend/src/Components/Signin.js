import React, { Component } from "react";
import { Link, RouteComponentProps, withRouter} from 'react-router-dom';
import Amplify, { Auth } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import Grid from '@material-ui/core/Grid';
import Cognito from "../Config/Cognito"
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";
import styled from "styled-components";

Amplify.configure(Cognito);
const AUTH_USER_TOKEN_KEY = 'ReactAmplify.TokenKey';

const User = styled.div`
    text-align: center;
    position: absolute;
    top: 1%;
    left: 30%;
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
    top: 1%;
    left: 39%;
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
    top: 3%;
    left: 50%;
`;

const Register = styled.div`
    text-align: center;
    justify-content: center;
    position: absolute;
    align-items: center;
    top: 8%;
    left: 48%;
    height: 100vh;
    
    
    
`;

// amplify-authenticator {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex: 1;
//     height: 100vh;
//   }

Amplify.configure(Cognito);


class Signin extends Component {

    constructor(props){
        super(props);
        this.state={
            username:"", password:"", loading: false
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
    this.setState({loading: true})
    console.log(this.state.username)
        await Auth.signIn(this.state.username, this.state.password)
        .then(user => {
            console.log(this.props)
            const history = this.props.history;
            const location = this.props.location;
            const { from } = location.state || {
                from: {
                    pathname:'/api'
                }
            };
            localStorage.setItem(AUTH_USER_TOKEN_KEY, user.signInUserSession.accessToken.jwtToken);
            console.log(user)
            
            window.location.pathname = "/api";

        })
        .catch(error => {
        console.log('error signing in', error);
        this.setState({loading:false})
        });
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
            <Register>
            <Button size="small" >
                    Create an Account
            </Button>
           
            </Register>
        
         </div>
        
    )
}


}

export default withRouter(Signin);