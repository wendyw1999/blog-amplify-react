import {Navbar, Nav,Row,Col,Badge,Spinner,Button,Form,Container,Toast} from 'react-bootstrap';
import React from "react";
import {NavLink, Link, withRouter } from "react-router-dom";




class Navigation extends React.Component {



    render() {


        return(


  <Navbar sticky="top" bg="light" variant="light">

<Row xs="auto">
    <div></div>
<NavLink exact className='navbar-item' to='/' activeStyle={{
    fontWeight: "bold",
  }}>
   Home
</NavLink>
    <NavLink activeStyle={{
    fontWeight: "bold",
  }} exact className='navbar-item' to='/signup'>Sign Up/Sign In</NavLink>
      <NavLink activeStyle={{
    fontWeight: "bold",
  }} exact className='navbar-item' to='/blog'>My Blog</NavLink>
  </Row>

  </Navbar>
        )
    }
}

export default Navigation;