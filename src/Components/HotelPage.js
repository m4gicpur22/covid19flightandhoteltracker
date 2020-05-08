import React, {Component} from 'react';
import axios from 'axios';
import ConfigFile from '../config/default.json'; //location of Auth Configs used to access TravelPayouts API
import {
    Navbar,
    Nav,
    Form,
    Button,
    FormControl,
    Card,
    Container,
    Row,
    Col,
    Dropdown,
    DropdownButton
} from "react-bootstrap";

const AuthAccess = ConfigFile.UserInfo.AuthToken;

export class HotelPage extends Component {

    render(){
        return(
            <React.Fragment>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand onClick={ () => window.location.reload(true) }>FlightandHotel Tracker</Navbar.Brand>
                <Nav className="mr-auto">
                    <Button variant="outline-info" style={ {padding: "5px"}, {margin: "5px"} }>Hotels for the Month</Button>
                    <Button variant="outline-info" style={ {padding: "5px"}, {margin: "5px"} }>Hotels Bookings</Button>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                </Form>
            </Navbar>
      </React.Fragment>
        );
    }
}

export default HotelPage;