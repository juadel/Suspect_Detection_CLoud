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
import Alert from "@material-ui/lab/Alert";
import Modal from '@material-ui/core/Modal';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import { Avatar, CardHeader } from "@material-ui/core";

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
const RegModal = styled.div`
    background-color : rgb(247, 239, 239);
    color: rgb(255, 255, 255);
    font-weight: bold;

    border-radius: 25px;
    position: absolute;
    

    /* z-index: 2; */
    width: 30%;
    padding: 15px;
    text-align: center;
    
`;



Amplify.configure(Cognito);


class Signin extends Component {

    constructor(props){
        super(props);
        this.state={
            username:"", password:"", loading: false, newUsername: "", newPassword:"", setOpenRegisterModal: false, userConfirmed: null , 
            setOpenConfirmModal: false, code: null
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

handleClose = ()=>{
    this.setState({
        setOpenRegisterModal: false,
        setOpenConfirmModal : false
    })
}

handleCreateAccount = ()=>{
    this.setState({
        setOpenRegisterModal: true
    })
}

handleSubmitCreate =() =>{
    this.signUp()
}

handleSubmitValidate =() =>{
    this.validate()
}

handleResendCode =()=>{
    this.reSendCode()
}

async  signIn() {
    this.setState({loading: true})
    //console.log(this.state.username)
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
        if (error.code==="NotAuthorizedException"){
            alert(error.message)
        }
        else{
            this.setState({
                loading:false,
                setOpenConfirmModal:true
                });
            alert("Please confirm you e-mail");
        }
    })
}

async signUp(){
    let username = this.state.newUsername;
    let password = this.state.newPassword;
    let email = this.state.email;
    let phone_number = this.state.phone_number;
    let name = this.state.name;
    await Auth.signUp({
        username,
        password,
        attributes:{
            email,
            phone_number,
            name
        }

    }).then(user =>{
        this.setState({
            userConfirmed: user.userConfirmed,
            setOpenConfirmModal: true 
        })
    }).catch(error =>{
        console.log('error signing in', error);
        alert(error.message)}
    ) 
}

async validate(){
    console.log(this.state.username)
    await Auth.confirmSignUp(this.state.username, this.state.code)
    .then(user => {
        this.setState({
            userConfirmed: user.userConfirmed,
            setOpenConfirmModal: false,
            setOpenRegisterModal: false
        })
        alert("email validated, please log in")
    })
    .catch(error =>{
        console.log('error Validating, error');
        alert(error.message)}
    )
}

async reSendCode(){
    try{
        await Auth.resendSignUp(this.state.username);
        console.log('code resent successfully');
    } catch (err){
        console.log('error resending code: ', err);
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
            <Register>
            <Button size="small" onClick={this.handleCreateAccount}>
                    Create an Account
            </Button>
           
            </Register>
            {/* // -------------------------------------- REGISTER FORM ---------------------------------------------// */}
            
            <Modal open={this.state.setOpenRegisterModal} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <RegModal>
               
                <Card>
                    <CardHeader avatar={<Avatar>A</Avatar>} title="New Account"/>
                   
                <CardContent>
                <Typography variant="body2" color="inherit" component="p" align="justify">
                            
                            <li>Password must be minimum 8 characters long.</li>
                            <li>Password must have at least one special characters.</li>
                            <li>Password must have at least one capital letter.</li>
                            <li>Include the country code in Phone number.</li>
                            <li>E.g., Phone: +12345678910</li>
                            
                        
                        
                </Typography>
                <TextField required id="standard-required-5" label="Name"  onChange={this.handleFormInput} name="name"/>
                <TextField required id="standard-required-1" label="Username"  onChange={this.handleFormInput} name="newUsername"/>
                <TextField required id="standard-password-input-2" label="Password" type="password" onChange={this.handleFormInput} name="newPassword"/>
                <TextField required id="standard-required-3" label="e-mail"  onChange={this.handleFormInput} name="email"/>
                <TextField required id="standard-required-4" defaultValue="+1" label="Phone Number"  onChange={this.handleFormInput} name="phone_number"/>
                
                
                </CardContent>
                <CardActions>
                    <Button variant="contained" size="small"  onClick={this.handleSubmitCreate}>
                    Sign Up
                    </Button>    
                </CardActions>
                </Card>
                
            </RegModal>
            </Modal>
            {/* // -------------------------------------- CONFIRM FORM ---------------------------------------------// */}
            <Modal open={this.state.setOpenConfirmModal} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <RegModal>
               
                <Card>
                    <CardHeader title="Confirm your Account"/>
                   
                <CardContent>
                <Typography variant="body2" color="inherit" component="p" align="justify">
                            
                            <li>Please check your email.</li>
                            <li>Validate the code.</li>        
                </Typography>
                <TextField required id="standard-required-5" label="Validation Code"  onChange={this.handleFormInput} name="code"/>
                
                
                
                </CardContent>
                <CardActions>
                    <Button variant="contained" size="small"  onClick={this.handleSubmitValidate}>
                    Validate
                    </Button>
                    <Button variant="contained" size="small"  onClick={this.handleResendCode}>
                    Re-send code
                    </Button>        
                </CardActions>
                </Card>
                
            </RegModal>
            </Modal>
            
         </div>
        
    )
}


}

export default withRouter(Signin);