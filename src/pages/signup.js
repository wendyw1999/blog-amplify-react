import React from 'react';
import { Auth } from 'aws-amplify';
import { AmplifyAuthContainer,
    AmplifyAuthenticator,AmplifySignOut} from "@aws-amplify/ui-react";
  import {Button,Form,Container} from "react-bootstrap";
import { 
    Authenticator, SignIn, SignUp, ConfirmSignUp, Greetings } from 'aws-amplify-react';

import styles from "../mystyle.module.css";


// class AlwaysOn extends React.Component {

//     constructor(props) {
//         super(props)
//     }

//     render() {
//         return (
//             <div>
//             <div>I am always here to show current auth state: {this.props.authState}</div>
//             <Button onClick={() => this.props.onStateChange('signUp')}>Show Sign Up</Button>
//         </div>
//         )
//     }
// }
class SignUpComponent extends React.Component {
constructor(props) {
    super(props)
    this.state={
        signedIn:false,
    }
}





    render() {

        return (

            <div>
                <  AmplifyAuthContainer>
                <AmplifyAuthenticator>

                   
<Container className="text-center" style={{width:"70%",alignItems:"center",justifyContent:"center"}}>
    
    
          <AmplifySignOut />
</Container>

</AmplifyAuthenticator>

                </AmplifyAuthContainer>
               
  {/* <Container style={styles.bigblue}>
      okkk
  <Authenticator hideDefault={true}>
            <SignIn/>
            <SignUp/>
            <ConfirmSignUp/>
            <Greetings
            inGreeting={(username) => 'Hello ' + username}
            outGreeting="Please sign in..."
            />
        </Authenticator>
  </Container> */}

            </div>
        )



    }


}

export default SignUpComponent;