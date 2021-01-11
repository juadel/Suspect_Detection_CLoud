import React, { Component } from "react";
import 'fontsource-roboto';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import styled from "styled-components";
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
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
            cameraId: "", username:"admin", password:"12345", cam_Location:"", ip:"", server_Status:"", 
            url_path: "Streaming/Channels/101", server_info: "", port:"554", req_Status:"", userId:"", report_to:"",
            token: "", camerasList: null, setOpen: false, reload: null,
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

    handleEdit(camItem){
        
       
       this.setState({
           setOpen: true,
           cameraId: camItem.cameraId,
           cam_Location: camItem.cam_Location,
           ip: camItem.ip,
           port: camItem.port,
           url_path: camItem.url_path,
           username: camItem.username,
           password: camItem.password,
           report_to: camItem.report_to
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

    handleSubmit = () => {
        const newCam ={
            cam_Location: this.state.cam_Location,
            ip: this.state.ip,
            port: this.state.port,
            url_path: this.state.url_path,
            username: this.state.username,
            password: this.state.password
        }
        this.createNewCam(newCam);

    }

    handleEditSubmit =() =>{
        const editedCam ={
            cam_Location: this.state.cam_Location,
            ip: this.state.ip,
            port: this.state.port,
            url_path: this.state.url_path,
            username: this.state.username,
            password: this.state.password,
            report_to: this.state.report_to
        }
        //console.log(editedCam)
        this.updateCamera(this.state.cameraId, editedCam);
    }

    async handleDel(cameraId){
        await axios.delete(apiEndpoint+'/delcamera/'+cameraId,
        {
            headers:
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
        }).then(res =>{this.setState({reload: true})
        }).catch(e => {alert("The Camera was not deleted", e); console.log(e)});
        //window.location.pathname = "/api";
        this.getCameras();
     }

        
    async createNewCam(newCam){
        await axios.post(apiEndpoint+'/camset', newCam,
        {
            headers:
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
        }).then(res =>{this.setState({reload: true})
        }).catch(e => {alert("The request was not completed; Make sure to include all the required data", e); console.log(e)});
        //window.location.pathname = "/api";
        this.getCameras();
        this.handleClose();
    }

    async updateCamera(cameraId, editedCam){
        await axios.patch(apiEndpoint+'/camera/'+cameraId, editedCam,
        {
            headers:
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
        }).then(res =>{this.setState({reload: true})
        }).catch(e => {alert("The request was not completed; Make sure to include all the required data", e); console.log(e)});
        //window.location.pathname = "/api";
        this.getCameras();
        this.handleClose();
        
    }

    render() {
    
    let cameraLst = []
    if (this.state.camerasList)
        cameraLst= this.state.camerasList;
        
        const lstOfCameras = cameraLst.map((item) =>
                    
                    <tr >    
                        <td>{item.cam_Location}</td>
                        <td>{item.ip}</td>
                        <td>{item.port}</td>
                        <td>{item.url_path}</td>
                        <td>{item.username}</td>
                        <td>{item.password}</td>
                        <td>{item.server_info}</td>
                        <td>{item.report_to}</td>
                        <td> <Button onClick={() =>{this.handleEdit(item)}}>Edit</Button></td>
                        <td> <IconButton onClick={() =>{this.handleDel(item.cameraId)} } aria-label="delete"><DeleteIcon/></IconButton></td>
                        
                    
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
                                <TableCell align="center"> Location</TableCell>
                                <TableCell align="center"> Camera IP</TableCell>
                                <TableCell align="center"> Port</TableCell>
                                <TableCell align="center"> URL Path</TableCell>
                                <TableCell align="center"> Username</TableCell>
                                <TableCell align="center"> Password</TableCell>
                                <TableCell align="center"> Status</TableCell>
                                <TableCell align="center"> Report To</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                           {lstOfCameras}
                        </TableBody>
                   </Table>
               </TableContainer>

               <Modal open={this.state.setOpen} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Container maxWidth="md" disableGutters="true">
                  <Card>
                  <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Edit Camera
                        </Typography>
                       
                        <TextField required id="standard-required-1" label="Location" defaultValue={this.state.cam_Location} onChange={this.handleFormInput} name="cam_Location"/>
                        <TextField required id="standard-disabled-2" label="IP"  defaultValue={this.state.ip} onChange={this.handleFormInput} name="ip"/>
                        <TextField required id="standard-disabled-3" label="PORT" defaultValue={this.state.port} onChange={this.handleFormInput} name="port"/>
                        <TextField required id="standard-disabled-4" label="URL/Path" defaultValue={this.state.url_path} onChange={this.handleFormInput} name="url_path"/>
                        <TextField required id="standard-disabled-5" label="username" defaultValue={this.state.username}  onChange={this.handleFormInput} name="username"/>
                
                
                        <TextField required
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        defaultValue={this.state.password} 
                        autoComplete="current-password"
                        onChange={this.handleFormInput} name="password"
                        />
                        <TextField required id="standard-disabled-6" label="Report to" defaultValue={this.state.report_to} onChange={this.handleFormInput} name="report_to"/>

                  </CardContent>
                        
                  
                  <CardActions>
                  <Button variant="contained"  onClick={this.handleEditSubmit} >Submit</Button>
                  <Button size="small"  onClick={this.handleClose}>Cancel</Button>  
                  </CardActions>  
                  </Card>            
                </Container>
                </Modal>
              
               
                <NewCamerasContainer>
                <Card>
                <Typography gutterBottom variant="h5" component="h3">
                        New camera 
                </Typography>
                
                <CardContent>
                
                <Typography variant="body2" color="inherit" component="p" align="justify">
                    <ul> 
                        <li>Add a new camera using RTSP protocol </li>
                        <li>The camera must be connected to the internet.</li>
                        <li>Set port forwarding on your Internet Router. Check the following <a href="https://www.purevpn.com/blog/how-to-forward-ports-on-your-router/" rel="noreferrer" target="_blank" >link</a> to learn how to do it.</li>
                        <li>Find here the <a href="https://www.getscw.com/decoding/rtsp#:~:text=1.210.-,You%20can%20also%20encode%20credentials%20into%20the%20URL%20by%20entering,and%2012345%20is%20the%20password." target="_blank">RTSP stream URL/Path </a> for your camera brand. </li>
                    </ul>
                    
                </Typography>
             
                </CardContent>
                <TextField required id="standard-required-1" label="Location"  onChange={this.handleFormInput} name="cam_Location"/>
                <TextField required id="standard-disabled-7" label="IP"  onChange={this.handleFormInput} name="ip"/>
                <TextField required id="standard-disabled-8" label="PORT" defaultValue="554" onChange={this.handleFormInput} name="port"/>
                <TextField required id="standard-disabled-9" label="URL/Path" defaultValue="Streaming/Channels/101" onChange={this.handleFormInput} name="url_path"/>
                <TextField required id="standard-disabled-10" label="username" defaultValue="admin" onChange={this.handleFormInput} name="username"/>
                
                
                <TextField required
                id="standard-password-input"
                label="Password"
                type="password"
                defaultValue="12345"
                autoComplete="current-password"
                onChange={this.handleFormInput} name="password"
                />
            
              
                
                <CardActions>
                    <Button variant="contained" size="small"  onClick={this.handleSubmit}>
                    add
                    </Button>
                    <Button size="small" >
                    Learn More
                    </Button>
                </CardActions>
                
                </Card>
                </NewCamerasContainer>
            
            
            </Container>
            
            )
    }
}


export default Cameras;