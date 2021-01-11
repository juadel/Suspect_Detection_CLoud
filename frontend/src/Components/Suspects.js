import React, { Component } from "react";
import 'fontsource-roboto';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
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
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import { Avatar, CardHeader } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress'

const NewSuspectContainer = styled.div`
    display: flex;
    padding-top: 100px;
    padding-left: 200px;
    
`;
const ButtonAdd = styled.div`
    display : flex;
    padding-top: 20px;
    padding-left: 100px;

`;
const ButtonRefresh = styled.div`
    display : flex;
    
    padding-left: 20px;

`;

const ImagesSuggestion = styled.div`
    display: center;
    padding-left: 130px;
  
`;
    
class Suspects extends Component {
    
    constructor(){
        super();
        this.state={
            suspectName:"", findings: null, encoding:"", encoding_status:"", objectKey:"", 
            token: "", suspectsList: null, setOpen: false, reload: null, file: "", filename:"", userId: "",
            modal_File: false, presignedURL:"", setOpenAddModal: false, uploadProgress: null
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
        this.handleClose();

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

    updateProgressBarValue(percentage){
        
        if (percentage !== 0){

            return(<LinearProgress variant="determinate" value={percentage} />)
        }
            
        
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

        await axios.put(this.state.presignedURL, this.state.file,{
            onUploadProgress: (Progress) => {
                if (Progress.lengthComputable) {
                        console.log(Progress.loaded + ' ' + Progress.total);
                        if (Progress.total!==null){
                                 this.setState({uploadProgress: Math.round((Progress.loaded *100)/Progress.total)})
                             }
                    }
              } 
         
        }).then(res => { 
            alert("File has been uploaded");
            //window.location.pathname = "/api";
            this.getSuspects();
            this.handleClose();
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
        //window.location.pathname = "/api";
        this.getSuspects();
     }

        
    async createNewSuspect(newSuspect){
        await axios.post(apiEndpoint+'/suspect', newSuspect,
        {
            headers:
            { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`}
        }).then(res =>{this.setState({reload: true})
        }).catch(e => {alert("The request was not completed; Make sure to include all the required data", e); console.log(e)});
        //window.location.pathname = "/api";
        this.getSuspects();
    }

    getfindingsDate(item){
       
        if (Object.keys(item.findings).length!==0){
            let UTC_time = item.findings[Object.keys(item.findings).length-1].date + " UTC"
            
            let localDate = new Date(UTC_time)
            
            return (localDate.toLocaleDateString() +" "+ localDate.toLocaleTimeString())
        }
        else {
            return "N/A"
        }
                                    
    }
    getfindingsLocation(item){
        
        if (Object.keys(item.findings).length!==0){
            return (item.findings[Object.keys(item.findings).length-1].location)
        }
        else {
            return "N/A"
        }
                                    
    }
    handleReload =() =>{
        this.getSuspects();
    }
    

    render() {
    let progressBar = this.updateProgressBarValue(this.state.uploadProgress)       
    let suspectLst = []
    if (this.state.suspectsList){
        suspectLst= this.state.suspectsList;
        
    }
        
        const lstOfSuspects= suspectLst.map((item) => 
                        
                    <tr >    
                        <td >{item.suspectName}</td>
                        <td>{item.encoding_status}</td>
                        <td>{this.getfindingsDate(item)}</td>
                        <td>{this.getfindingsLocation(item)}</td>                        
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
                                <TableCell align="center"> Last Seen</TableCell>
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
               <Button variant="contained" size="small"  onClick={this.handleNewSusp}> Add </Button>
               <ButtonRefresh>
               <Button variant="contained"  align="justify" onClick={this.handleReload} >Refresh</Button>
               </ButtonRefresh>
               </ButtonAdd>
               

              
                {/*--------------------------------- MODAL FOR EDIT SUSPECT ---NOT IN USE-------------------------------------*/} 
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
                                     
                  <Button variant="contained"  onClick={this.handleEditSubmit} >Submit</Button>
                  <Button size="small"  onClick={this.handleClose}>Cancel</Button>  
                  </CardActions>  
                  </Card>            
                </Container>
                </Modal>
                {/*--------------------------------- MODAL FOR CHANGE IMAGE ----------------------------------------*/} 
                <Modal open={this.state.modal_File} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <Container maxWidth="xs" disableGutters="true">
                  <Card>
                  <ImagesSuggestion><img src="/Images/picFrame.jpg"/></ImagesSuggestion>
                <CardContent>
                
                </CardContent> 
                  <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Add/Change Image
                        </Typography>
                        <Typography variant="body2" color="inherit" component="p" align="justify">
                            
                                <li>For better detection and encoding results please use ID style images. </li>
                                <li>To crop an Image, use <a href="https://photoshop.adobe.com/" target="_blank" >Adobe Photoshop online</a> App.</li>
                                
                            
                            
                        </Typography>
                        
                        <TextField required id="standard-required" label="File"  onChange={this.handleFile} name="objectKey" type="file" />

                  </CardContent>
                  <CardActions>  
                  <Button variant="contained"  onClick={this.handleSubmitFile} >Submit</Button>
                  <Button size="small"  onClick={this.handleClose}>Cancel</Button>  
                  
                  </CardActions>  
                  
                  </Card>   
                  <div>{progressBar}</div>         
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
                        <li>Please generate encodings after adding a new suspects</li>
                    </ul>
                    <TextField required id="standard-required-1" label="Name"  onChange={this.handleFormInput} name="suspectName"/>
                </Typography>
                </CardContent>
                <CardActions>
                    <Button variant="contained" size="small"  onClick={this.handleSubmit}>
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