import React, { Component } from "react";

import Grid from '@material-ui/core/Grid';

import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";


class Main extends Component {

render(){
    return(
        <Card>
            <Typography variant="body2" component="h2"  color="textSecondary" gutterBottom>                  
            System Status:
            </Typography>
        </Card>
        
    )
}


}

export default Main