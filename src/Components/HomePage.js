import React, {Fragment, Component} from 'react';
import {
    Button,
    Navbar,
    Nav,
    Image
} from "react-bootstrap";
import FlightImage from '../PNGFiles/tom-barrett-M0AWNxnLaMw-unsplash.jpg';
import '../CSSsheets/Travels.css';

export class HomePage extends Component {

    render(){
        return(
            <Fragment>
                <Navbar bg="dark" variant="dark" className="NavBar">
                    <Navbar.Brand onClick={ () => window.location.reload(true) }>CovidTravel</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Button variant="outline-info" href="/Flights" style={{padding: "5px"}, {margin: "5px"}}>Flights</Button>
                        <Button variant="outline-info" href="/Hotels" style={{padding: "5px"}, {margin: "5px"}}>Hotels</Button>
                    </Nav>
                </Navbar>
                <div>
                    <Image src={FlightImage} style={ {height: "100%"}, {width: "100%"}} />
                </div>
            </Fragment>
        );
    }
}

export default HomePage