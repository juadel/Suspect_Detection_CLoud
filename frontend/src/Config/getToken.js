import { Auth } from 'aws-amplify';
import React, {Component} from 'react';

class getToken extends Component {

    constructor(){
        super();
        this.state ={
            jwtToken :"",
            user :""
                    };
         this.token();
    }
    async token(){
        
        await Auth.currentSession()
                .then(data => {this.state.jwtToken = data.idToken.jwtToken })
                .catch(e => console.log(e))
        await Auth.currentAuthenticatedUser()
                .then(user => {this.state.user = user.username})
                .catch(e => console.log(e))
                  //console.log(this.state.jwtToken)
        
        
    }


}
 export default getToken;