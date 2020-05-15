import React, {Fragment, Component} from 'react';
import axios from 'axios';
import ConfigFile from '../config/default.json'; //location of Auth Configs used to access TravelPayouts API
import {
    Button,
    Navbar,
    Nav,
    Form,
    FormControl
} from "react-bootstrap";
import FlightImage from '../PNGFiles/tom-barrett-M0AWNxnLaMw-unsplash.jpg';
import '../CSSsheets/Travels.css';

const AuthAccess = ConfigFile.UserInfo.AuthToken;

export class HomePage extends Component {

    render(){
        return(
            <Fragment>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand onClick={ () => window.location.reload(true) }>HomePage</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Button variant="outline-info" href="/Flights" style={ {padding: "5px"}, {margin: "5px"}}>Flights</Button>
                        <Button variant="outline-info" href="/Hotels" style={{padding: "5px"}, {margin: "5px"}}>Hotels</Button>
                    </Nav>
                </Navbar>
                <div>
                    <img src={FlightImage} alt="Flightimage"></img>
                </div>
            </Fragment>
        );
    }
}

export default HomePage