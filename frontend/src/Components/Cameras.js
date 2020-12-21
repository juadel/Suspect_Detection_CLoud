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
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';

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
            token: "", camerasList: null, setOpen: false
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

    handleEdit(cameraId){
        
       console.log(cameraId)
       this.setState({
           setOpen: true
       })
    }
    
    handleClose = () => {
        this.setState({
            setOpen:false
        })
    }
    
    handleFormInput = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name] : value })
    }


    render() {
    console.log(this.state.cam_Location);
    let cameraLst = []
    if (this.state.camerasList)
        cameraLst= this.state.camerasList;
        console.log(cameraLst)
        const lstOfCameras = cameraLst.map((item) =>
                    
                    <tr >    
                        <td>{item.cam_Location}</td>
                        <td>{item.ip}</td>
                        <td>{item.port}</td>
                        <td>{item.url_path}</td>
                        <td>{item.username}</td>
                        <td>{item.password}</td>
                        <td>{item.server_info}</td>
                        <td> <Button onClick={() =>{this.handleEdit(item.cameraId)}}>Edit</Button></td>
                        <td> <IconButton aria-label="delete"><DeleteIcon/></IconButton></td>
                        
                    
                    </tr>
                    )
    
    return (
            
           <Container >
               <Typography gutterBottom variant="h5" component="h3">
                        Registered Cameras
                </Typography>
               <TableContainer component={Card}>
                   <Table selectable={false} >
                        <TableHead >
                            <TableRow >
                                <TableCell> Location</TableCell>
                                <TableCell> Camera IP</TableCell>
                                <TableCell> Port</TableCell>
                                <TableCell> URL Path</TableCell>
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

               <Modal open={this.state.setOpen} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Container maxWidth="xs" disableGutters="true">
                  <Card>
                  <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Test for Edit Camera
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <p>Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica  
                            </p>
                        </Typography>
                        <Button variant="contained" color="primary" >Submit</Button>
                        <Button size="small" color="primary" onClick={this.handleClose}>Cancel</Button>
                  </CardContent>
                  </Card>
                  
                </Container>
                </Modal>
              
                <form >
                <NewCamerasContainer>
                <Card>
                <CardActionArea >
                <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                        New camera 
                </Typography>
                <Typography variant="body2" color="inherit" component="p" align="justify">
                    <ul> 
                        <li>Add a new camera using RTSP protocol </li>
                        <li>The camera must be connected to the internet.</li>
                        <li>Port forwarding on your Internet Router. Check the following <a href="https://www.purevpn.com/blog/how-to-forward-ports-on-your-router/">link</a> to learn how to do it.</li>
                        <li>Find here the <a href="https://www.getscw.com/decoding/rtsp#:~:text=1.210.-,You%20can%20also%20encode%20credentials%20into%20the%20URL%20by%20entering,and%2012345%20is%20the%20password.">RTSP stream URL/Path </a> for your camera brand. </li>
                    </ul>
                    
                </Typography>
             
                </CardContent>
                <TextField required id="standard-required" label="Location" defaultValue="Front Door" onChange={this.handleFormInput} name="cam_Location"/>
                <TextField required id="standard-disabled" label="IP" defaultValue="192.168.2.100" />
                <TextField required id="standard-disabled" label="PORT" defaultValue="554" />
                <TextField required id="standard-disabled" label="URL/Path" defaultValue="Streaming/Channels/101" />
                <TextField required id="standard-disabled" label="username" defaultValue="admin" />
                
                
                <TextField required
                id="standard-password-input"
                label="Password"
                type="password"
                defaultValue="12345"
                autoComplete="current-password"
                />
            
              
                
                <CardActions>
                    <Button variant="contained" size="small" color="primary">
                    add
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