const Cognito = {
    Auth: {
      // Amazon Cognito Region
      region: "ca-central-1",
  
      // Amazon Cognito User Pool ID
      userPoolId: "ca-central-1_XnEjC2aNQ",
  
      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: "6ftbmlnodn581rjeahm79469oc",
      oauth: {
        domain: 'https://sdc.auth.ca-central-1.amazoncognito.com',
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'https://localhost:3000/api',
        redirectSignOut: 'http://localhost:3000/',
        responseType: 'token' // or 'token', note that REFRESH token will only be generated when the responseType is code
      }
    }
  };
  
  export default Cognito;