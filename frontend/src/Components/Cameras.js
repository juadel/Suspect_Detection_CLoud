import React, { Component } from "react";
import 'fontsource-roboto';
//import Jumbotron from 'react-bootstrap/Jumbotron';
//import Button from 'react-bootstrap/Button';
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

    
class Cameras extends Component {
    
    
    render() {
    
    return (
           <Container maxWidth="md" >
           
            {/* <Card>
                <CardActionArea  >
                <CardMedia
                    component="img"
                    alt="Contemplative Reptile"
                    height="140"
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                    />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        <p>Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica  jhkjdshdjkhadkjhdsfjhdsjfkhdjkfhdsjkfdjfdjkchzkjcjkcjkcbcsdbsdbjdscZNMcfZNMB
                        </p>
                    </Typography>
                </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button variant="contained" size="small" color="primary">
                    Share
                    </Button>
                    <Button size="small" color="primary">
                    Learn More
                    </Button>
                </CardActions>
            </Card> */}
            <form>
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
            </form>
            </Container>
            
            )
    }
}


export default Cameras;