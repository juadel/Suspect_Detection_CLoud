import React, { Component } from "react";
import 'fontsource-roboto';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import styled from "styled-components";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import getToken from '../Config/getToken'
import apiEndpoint from '../Config/Apibackend'
import axios from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';

const NewCamerasContainer = styled.div`
    display: flex;
    padding-top: 100px;
    
`;
    
class Cameras extends Component {
    
    constructor(){
        super();
        this.state={
            cameraId: "", username:"", password:"", cam_Location:"", ip:"", server_Status:"", 
            url_path: "", server_info: "", port:"", req_Status:"", userId:"", report_to:"",
            token: "", camerasList: null
        };
             
        
    }

    async componentDidMount(){
        await this.handleAuth();
        this.getCameras();
     
    }

    async handleAuth(){
        let token = new getToken();
        await token.token()
        this.setState({
            token: token.state.jwtToken
        })

    }
    async getCameras(){
        // console.log(this.state.token)
        
        await axios.get(apiEndpoint+'/getcameras', 
            {headers: 
                { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`}
             }).then(res => {this.setState({camerasList: res.data.item});
               })
          .catch(e => console.log(e))
        
    }


    render() {
    console.log(this.state.camerasList);
    let cameraLst = []
    if (this.state.camerasList)
        cameraLst= this.state.camerasList;
        console.log(cameraLst)
        const lstOfCameras = cameraLst.map((item) =>
                    
                    <tr >    
                    
                        <td >{cameraLst.indexOf(item)+1}</td>
                        <td>{item.cam_Location}</td>
                        <td>{item.ip}</td>
                        <td>{item.port}</td>
                        <td>{item.url_path}</td>
                        <td>{item.username}</td>
                        <td>{item.password}</td>
                        <td>{item.server_info}</td>
                        
                    
                    </tr>
                    )
    
    return (
            
           <Container maxWidth="md" >
               <Typography gutterBottom variant="h5" component="h3">
                        Registered Cameras
                </Typography>
               <TableContainer component={Card}>
                   <Table  multiSelectable={true} onRowSelection={this.onRowSelection}>
                        <TableHead>
                            <TableRow >
                               
                                <TableCell> Item </TableCell>
                                <TableCell> Location</TableCell>
                                <TableCell> Camera IP</TableCell>
                                <TableCell> Port</TableCell>
                                <TableCell> URL</TableCell>
                                <TableCell> Username</TableCell>
                                <TableCell> Password</TableCell>
                                <TableCell> Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                           {lstOfCameras}
                        </TableBody>
                   </Table>
               </TableContainer>
                
                <form >
                <NewCamerasContainer>
                <Card>
                <CardActionArea >
                <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                        New camera settings
                </Typography>
                <Typography variant="body2" color="inherit" component="p" align="justify">
                    Add a new camera using RTSP protocol; The camera must be connected to the internet.
                    You would probably need to set up port forwarding on your Internet Router. Check the following <a href="https://www.purevpn.com/blog/how-to-forward-ports-on-your-router/">link</a> to learn how to do it.
                    
                </Typography>
             
                </CardContent>
                <TextField required id="standard-required" label="Required" defaultValue="Hello World" />
                <TextField disabled id="standard-disabled" label="Disabled" defaultValue="Hello World" />
                <TextField
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                />
                <TextField
                id="standard-read-only-input"
                label="Read Only"
                defaultValue="Hello World"
                InputProps={{
                    readOnly: true,
                }}
                />
                <TextField
                id="standard-number"
                label="Number"
                type="number"
                
                />
                
                <CardActions>
                    <Button variant="contained" size="small" color="primary">
                    Share
                    </Button>
                    <Button size="small" color="primary">
                    Learn More
                    </Button>
                </CardActions>
                </CardActionArea>
                </Card>
                </NewCamerasContainer>
            </form>
            
            </Container>
            
            )
    }
}


export default Cameras;