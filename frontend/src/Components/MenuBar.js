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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Auth } from 'aws-amplify';
import {Route, Switch, withRouter} from 'react-router-dom';

const User= styled.div`
    display: flex;
    position: absolute;
    right: 50px;
    
`;
const MenuName = styled.p`
    font-family: "Open Sans", sans-serif;
    display: flex;
    font-size: 30px;
    line-height: 1.5;
    font-weight: 800;
    text-align: left;
    color: #3D55B8;
    margin-left: 50px;
    position: absolute;  
`;

const MenuUser = styled.p`
    font-family: "Open Sans", sans-serif;
    display: flex;
    font-size: 20px;
    line-height: 1.5;
    font-weight: 500;
    
    color: #3D55B8;
    right: 120px;
    position: absolute;  
`;

class Menubar extends Component {
    
    constructor(){
        super();
        this.state={
            token:"" , user:"", openMenu: false, anchorEl: null
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
    
    handleClose =(event) =>{
        this.setState({
            openMenu: false
        })
    }
    
    handleMenu = (event) =>{
        this.setState({
            openMenu: true,
            anchorEl : event.currentTarget
        })

    }

    handleLogout = () =>{
        this.signOut()
    }
    
    async signOut(){
        try {
            await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }

    }

    handleRoute = route =>() =>{
        this.props.history.push({pathname: route})
        this.setState({
            openMenu: false
        })
    }



    render(){
        
        return(
            <AppBar position="static" color="inherit" >
            <Toolbar>
                <MenuName>
                <p>Cloud's Face Detection System</p>
                </MenuName>
                
                <MenuUser>{this.state.user}</MenuUser>
                <User>
                    <Button title="Accout Management" onClick={this.handleMenu}><Avatar/></Button>
                    <Menu id="simple-menu" open={this.state.openMenu} anchorEl={this.state.anchorEl} onClose={this.handleClose}
                    
                        keepMounted
                        >
                    
                    <MenuItem onClick={this.handleRoute("/account")}>My account</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>

                    </Menu>
                </User>
                
                
            </Toolbar>
            </AppBar>

        )
    }

}

export default withRouter(Menubar);