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
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Avatar, CardHeader } from "@material-ui/core";

const NewSuspectContainer = styled.div`
    display: flex;
    padding-top: 100px;
    padding-left: 200px;
    
`;
const ButtonAdd = styled.div`
    display : flex;
    padding-top: 20px;
    padding-left: 100px;

`
    
class Suspects extends Component {
    
    constructor(){
        super();
        this.state={
            suspectName:"", findings: null, encoding:"", encoding_status:"", objectKey:"", 
            token: "", suspectsList: null, setOpen: false, reload: null, file: "", filename:"", userId: "",
            modal_File: false, presignedURL:"", setOpenAddModal: false
        };
         
        
    }

    

    handleEdit(item){
        console.log(this.state.suspectName)
       
       this.setState({
           setOpen: true,
           suspectName: item.suspectName   
        })

    }
    
    handleClose = () => {
        this.setState({
            setOpen:false,
            modal_File:false,
            setOpenAddModal :false
        })
    }
    
    handleFormInput = event => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name] : value })
    }

    handleSubmit = () => {
        const newSuspect ={
            suspectName: this.state.suspectName,
        }
        this.createNewSuspect(newSuspect);

    }

    handleModalFile(item){
        
        this.setState({
            modal_File: true,
            suspectName: item.suspectName
        })
       
        
        
    }

    handleFile = event =>{
        
        this.setState({
            file: event.target.files[0], 
            filename: event.target.files[0]['name'] 
            });   
        
    }

    handleNewSusp = () =>{
        this.setState({
            setOpenAddModal: true,  
         })

    }

    async componentDidMount(){
        await this.handleAuth();
        this.getSuspects();
     
    }

    async handleAuth(){
        let token = new getToken();
        await token.token()
        this.setState({
            token: token.state.jwtToken,
            userId: token.state.user
        })

    }
    async getSuspects(){
        // console.log(this.state.token)
        
        await axios.get(apiEndpoint+'/getsuspects', 
            {headers: 
                { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`}
             }).then(res => {this.setState({suspectsList: res.data.item});
               })
          .catch(e => console.log(e))
        
    }

    handleSubmitFile = () =>{
                
        const newSuspect = {
            suspectName: this.state.suspectName,
            filename: this.state.filename
        }
        this.editFileSuspect(newSuspect);
    }

    async editFileSuspect(newSuspect){
        console.log(newSuspect)
        await axios.post(apiEndpoint+'/getuploadurl', newSuspect,
            {   
                headers:
                { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${this.state.token}`}
            }).then(res =>{this.setState({presignedURL: res.data.uploadUrl})
            }).catch(e => {alert("Erro while procesing request", e); console.log(e)});
        console.log(this.state.presignedURL)

        await axios.put(this.state.presignedURL, this.state.file)
        .then(res => { 
            alert("File has been uploaded");
            window.location.reload();
        }).catch(e => alert(e));

    }

    async handleDel(suspectName){
        console.log(suspectName)
        await axios.delete(apiEndpoint+'/delsuspect/'+suspectName,
        {
            headers:
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
        }).then(res =>{this.setState({reload: true})
        }).catch(e => {alert("The Suspect was not deleted", e); console.log(e)});
        window.location.reload();
     }

        
    async createNewSuspect(newSuspect){
        await axios.post(apiEndpoint+'/suspect', newSuspect,
        {
            headers:
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
        }).then(res =>{this.setState({reload: true})
        }).catch(e => {alert("The request was not completed; Make sure to include all the required data", e); console.log(e)});
        window.location.reload();
    }


    render() {
    
    let suspectLst = []
    if (this.state.suspectsList){
        suspectLst= this.state.suspectsList;
    }
        const lstOfSuspects= suspectLst.map((item) =>
                    
                    <tr >    
                        <td >{item.suspectName}</td>
                        <td>{item.encoding_status}</td>
                        <td>{() =>{
                                    if (item.findings)
                                        return item.findings[item.findings.length - 1].date;
                                    else return ("N/A")
                                    }
                            }</td>
                        <td>{() =>{
                                    if (item.findings)
                                        return item.findings[item.findings.length - 1].location;
                                    else return "N/A"
                                    }
                            }</td>
                        
                        <td> <IconButton onClick={() =>{this.handleModalFile(item)} } aria-label="Add a Photo" type="file" ><AddAPhotoIcon/></IconButton></td>
                        <td> <IconButton onClick={() =>{this.handleDel(item.suspectName)} } aria-label="delete"><DeleteIcon/></IconButton></td>
                        
                    
                    </tr>
                    )
        
    
    return (
            
           <Container >
               {/*--------------------------------- SUSPECTS LIST ----------------------------------------*/} 
               <Typography gutterBottom variant="h5" component="h3">
                        Registered Profiles
                </Typography>
               <TableContainer component={Paper}>
                   <Table aria-label="simple table" size="small" stickyHeader="true" >
                        <TableHead >
                            <TableRow >
                                <TableCell align="center"> Name </TableCell>
                                <TableCell align="center"> Image Status</TableCell>
                                <TableCell align="center"> Last Seen (UTC)</TableCell>
                                <TableCell align="center"> Seen At</TableCell>
                                <TableCell align="center"> Add Image</TableCell>
                                <TableCell align="center"> Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                           {lstOfSuspects}
                        </TableBody>
                   </Table>
               </TableContainer>
               <ButtonAdd>
               <Button variant="contained" size="small" color="primary" onClick={this.handleNewSusp}> Add </Button>
               <Button size="small" color="primary"> Learn More</Button>
               </ButtonAdd>
                {/*--------------------------------- MODAL FOR EDIT SUSPECT ----------------------------------------*/} 
               <Modal open={this.state.setOpen} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Container maxWidth="xs" disableGutters="true">
                  <Card>
                  <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Edit Suspect
                        </Typography>
                        <TextField required id="standard-required" label="Name" defaultValue={this.state.suspectName} onChange={this.handleFormInput} name="suspectName"/>
                    </CardContent>                   
                  <CardActions>
                                     
                  <Button variant="contained" color="primary" onClick={this.handleEditSubmit} >Submit</Button>
                  <Button size="small" color="primary" onClick={this.handleClose}>Cancel</Button>  
                  </CardActions>  
                  </Card>            
                </Container>
                </Modal>
                {/*--------------------------------- MODAL FOR CHANGE IMAGE ----------------------------------------*/} 
                <Modal open={this.state.modal_File} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Container maxWidth="xs" disableGutters="true">
                  <Card>
                  <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Change Image
                        </Typography>
                        <TextField required id="standard-required" label="File"  onChange={this.handleFile} name="objectKey" type="file" />

                  </CardContent>
                  <CardActions>  
                  <Button variant="contained" color="primary" onClick={this.handleSubmitFile} >Submit</Button>
                  <Button size="small" color="primary" onClick={this.handleClose}>Cancel</Button>  
                  </CardActions>  
                  </Card>            
                </Container>
                </Modal>
              
               {/*--------------------------------- ADD NEW SUSPECT ----------------------------------------*/} 
               <Modal open={this.state.setOpenAddModal} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
               <Container maxWidth="xs" disableGutters="true">
                <Card>
                    <CardHeader avatar={<Avatar>S</Avatar>} title="New Suspect"></CardHeader>
                <CardContent>
                <Typography variant="body2" color="inherit" component="p" align="justify">
                    <ul> 
                        <li>Please generate encodings after adding all new suspects</li>
                    </ul>
                    <TextField required id="standard-required-1" label="Name"  onChange={this.handleFormInput} name="suspectName"/>
                </Typography>
                </CardContent>
                <CardActions>
                    <Button variant="contained" size="small" color="primary" onClick={this.handleSubmit}>
                    add
                    </Button>    
                </CardActions>
                </Card>
                </Container>
                </Modal>
            </Container>
            
            )
    }
}



export default Suspects;