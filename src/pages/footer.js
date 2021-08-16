import {Navbar, Nav,Row,Col,Badge,Spinner,Button,Form,Container,Toast} from 'react-bootstrap';
import React from "react";
import {NavLink, Link, withRouter } from "react-router-dom";




class Footer extends React.Component {



    render() {


        return(


            <Navbar variant="light" bg="light">
<Container>
Copyright &copy; <a href="https://github.com/wendyw1999">Caiwei Wang 2021</a>
</Container>
          </Navbar>
        )
    }
}

export default Footer;