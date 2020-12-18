import Button from '@material-ui/core/Button';
import React, { Component } from "react";
import styled from "styled-components";
import Modal from '@material-ui/core/Modal';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';



class Settings extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            setOpen: false,
            };
    }

    

    handleOpen = () => {
        this.setState({
            setOpen:true
        })
    }
    
    handleClose = () => {
        this.setState({
            setOpen:false
        })
    }
    
    
    render() {
    
    return (
        
      
      <Container maxWidth="sm">
      
        <Button variant="contained" onClick={this.handleOpen}>Open Modal</Button>
        
        <Modal open={this.state.setOpen} onClose={this.handleClose} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Container maxWidth="xs" disableGutters="true">
              <Card>
              <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <p>Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica  
                        </p>
                    </Typography>
                </CardContent>
             </Card>
            </Container>
        </Modal>
        
       
        </Container>
       
        
    )
    }
}


export default Settings;