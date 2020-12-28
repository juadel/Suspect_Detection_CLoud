import React, { Component } from "react";
import Amplify from 'aws-amplify';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import getToken from '../Config/getToken';
import { AmplifyGreetings, AmplifySignOut } from '@aws-amplify/ui-react';
import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import styled from "styled-components";

const User= styled.div`
    display: flex;
    position: absolute;
    right: 20px;
    
`;
const MenuName = styled.p`
    font-family: "Open Sans", sans-serif;
    display: flex;
    font-size: 40px;
    line-height: 1.5;
    font-weight: 800;
    text-align: left;
    color: #3D55B8;
    margin-left: 30px;
    position: absolute;
    
    
`;

class Menu extends Component {
    
    constructor(){
        super();
        this.state={
            token:"" , user:""
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
            user: token.state.user
        })

    }   
  
  



    render(){

        return(
            <AppBar position="static" color="inherit" >
            <Toolbar>
                <MenuName>
                <p>Cloud's Face Detection System</p>
                </MenuName>
                
            
                <User><Button title="Accout Management"><Avatar/></Button></User>
                
                
            </Toolbar>
            </AppBar>

        )
    }

}

export default Menu;