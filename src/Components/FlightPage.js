import React, {Component} from 'react';
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
    DropdownButton,
    Image,
    Alert
} from "react-bootstrap";
import axios from 'axios';
import ConfigFile from '../config/default.json'; //location of Auth Configs used to access TravelPayouts API
import FlightImage from '../PNGFiles/nathan-hobbs-qmWqUl8Uvsc-unsplash.jpg';
import '../CSSsheets/Travels.css';

const AuthAccess = ConfigFile.UserInfo.AuthToken;

export class FlightPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            FlightData: [],
            USACityCodes: [],
            booleanButtonCase: false,
            defaultoken: AuthAccess,
            OriginState: "",
            DestinationState: "",
            OriginCode: "",
            DestinationCode: "",
            DepartureDate: "",
            ReturnDate: ""
        };
        this.toggleFlights = this.toggleFlights.bind(this);
        this.renderMonthlyFlightDate = this.renderMonthlyFlightDate.bind(this);
        this.handleButtonSubmit = this.handleButtonSubmit.bind(this);
        this.renderFlightDatesData = this.renderFlightDatesData.bind(this);
    }

    toggleFlights() {
        this.setState({
            booleanButtonCase: !this.state.booleanButtonCase
        });
    }

    handleButtonSubmit(event) {

        event.preventDefault();

        const{OriginState, DestinationState, USACityCodes} = this.state;

        var OriginCityCode = "";
        var DestinationCityCode = "";

        if(OriginState === "" || DestinationState === "") //want this to return an alert to the screen
            console.log("Please Enter a Origin City and Destination");
        
        //this function is gonna compare the input with the USAcitycodes
        //call renderFlightDate function and pass the returned city codes as parameters

        //bug where cities that have the same name will return the lastest city code of those repeated city names in that array
        for(let i = 0; i < USACityCodes.length; i++){
            if(OriginState.toLowerCase() === USACityCodes[i].CityName.toLowerCase() ){
                console.log("City code Origin: " + USACityCodes[i].CityCode);
                OriginCityCode = USACityCodes[i].CityCode;
            }
            if(DestinationState.toLowerCase() === USACityCodes[i].CityName.toLowerCase() ){
                console.log("City code Destination: " + USACityCodes[i].CityCode);
                DestinationCityCode = USACityCodes[i].CityCode;
            }
        }

        this.setState({OriginCode: OriginCityCode});
        this.setState({DestinationCode : DestinationCityCode});

        //passing City Codes through
        this.renderMonthlyFlightDate(OriginCityCode, DestinationCityCode);
    }

    //obtaining all USA city codes before mounting data begins
    async componentWillMount() {
        //this function is going to get all the USA city codes from the travelpayouts API
        const CityCodes = [];

        let config = { //need to fix cors issues later
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Encoding": "gzip",
                "Access-Control-Allow-Origin": "*"
            }
        }

        let res = await axios.get(`https://api.travelpayouts.com/data/en/cities.json`, config);
        let CitiesData = res.data;

        for(let i in CitiesData){
            var citiesObject = {CityCode: "", CountryCode: "", CityName: ""};
            citiesObject["CityCode"] = CitiesData[i].code;
            citiesObject["CountryCode"] = CitiesData[i].country_code;
            citiesObject["CityName"] = CitiesData[i].name;
            if(citiesObject["CountryCode"] === "US")
                CityCodes.push(citiesObject);
        }

        this.setState({USACityCodes: CityCodes});
    }

    async renderFlightDatesData(event, DepartureDate, ReturnDate){
        //this function is gonna analyze dates taken by the user and show flights between departure date and return date given by the user
        event.preventDefault();

        const {OriginState, DestinationState, defaultoken, OriginCode, DestinationCode} = this.state;
        const FlightDateData = [];

        let config = { //need to fix cors issues later
            headers: {
                "x-access-token" : defaultoken,
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Encoding": "gzip",
                "Access-Control-Allow-Origin": "*"
            }
        }
        
        //bug with toggling between buttons for "Flights for the Month" and "Flights Tickets"
        let res = await axios.get(`https://api.travelpayouts.com/v1/prices/calendar?depart_date=${DepartureDate}&return_date=${ReturnDate}&origin=${OriginCode}&destination=${DestinationCode}&calendar_type=departure_date&currency=USD`, config);

        console.log("The data shown is " + JSON.stringify(res.data.data) );

        for(let [key, values] of Object.entries(res.data.data) ) {
            var flightobject = {flightDates: "", flightInfo:""};
            flightobject["flightDates"] = key;
            flightobject["flightInfo"] = values;
            FlightDateData.push(flightobject);
        }          

        this.setState({FlightData: FlightDateData});
    }

    async renderMonthlyFlightDate(Origin, Destination) {

        //axios call to obtain flight data for the upcoming month from USA
        //we are going to start by parsing data within United States
        const {defaultoken} = this.state;
        const currentMonthflightData = [];

        let config = { //need to fix cors issues later
            headers: {
                "x-access-token" : defaultoken,
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Encoding": "gzip",
                "Access-Control-Allow-Origin": "*"
            }
        }

        //current api for month of may airlines from orlando to new york
        //make this total data from all USA flights for the month

        let res = await axios.get(`https://api.travelpayouts.com/v1/prices/calendar?depart_date=2020-05&origin=${Origin}&destination=${Destination}&calendar_type=departure_date&currency=USD`, config);

        for(let [key, values] of Object.entries(res.data.data) ) {
            var flightobject = {flightDates: "", flightInfo:""};
            flightobject["flightDates"] = key;
            flightobject["flightInfo"] = values;
            currentMonthflightData.push(flightobject);
        }                   

        this.setState( {FlightData: currentMonthflightData} );
    }

    render() {

        const{FlightData, booleanButtonCase, DepartureDate, ReturnDate} = this.state;
        var NavBarClassName = !booleanButtonCase ? "NavBar" : "NavBar-NotFixed";

        return(
            <React.Fragment>
                <Navbar bg="dark" variant="dark" className={NavBarClassName}>
                    <Navbar.Brand onClick={ () => window.location.reload(true) }>CovidTravel</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Button variant="outline-info" href="/" style={ {padding: "5px"}, {margin: "5px"}} >Home</Button>
                        <DropdownButton variant="outline-info" id="dropdown-item-button" title="Flights for the Month" style={ {padding: "5px"}, {margin: "5px"}}>
                            <Form>
                                <Form.Group controlId="formGroupEmail" className="InputForm">
                                    <Form.Label className="InputText">Origin</Form.Label>
                                    <Form.Control style={{textAlign: "center"}} type="text" placeholder="Origin" onChange={ (e) => {
                                        this.setState({OriginState: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword" className="InputForm">
                                    <Form.Label className="InputText">Destination</Form.Label>
                                    <Form.Control style={{textAlign: "center"}} type="text" placeholder="Destination" onChange={ (e) => {
                                            this.setState({DestinationState: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                            </Form>
                            <div className="Button-Div">
                                <Button style={{margin: "0 auto"}} variant="info" onClick={ (event) => {
                                        if(this.state.OriginState === "" || this.state.DestinationState === ""){
                                            alert("Please Enter an Origin or Destination!");
                                        }
                                        else {
                                            this.handleButtonSubmit(event);
                                            this.toggleFlights();
                                        }
                                    }
                                }
                                >Submit</Button>
                            </div>
                        </DropdownButton>
                        <DropdownButton variant="outline-info" id="dropdown-item-button" title="Flights Tickets" style={ {padding: "5px"}, {margin: "5px"}}>
                            <Form>
                                <Form.Group controlId="formGroupEmail" className="InputForm">
                                    <Form.Label className="InputText">Departure Date</Form.Label>
                                    <Form.Control style={{textAlign: "center"}} type="text" placeholder="Departure Date" onChange={ (e) => {
                                        this.setState({DepartureDate: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGroupEmail" className="InputForm">
                                    <Form.Label className="InputText">Return Date</Form.Label>
                                    <Form.Control style={{textAlign: "center"}} type="text" placeholder="Return Date" onChange={ (e) => {
                                            this.setState({ReturnDate: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                            </Form>
                            <div className="Button-Div">
                            <Button variant="info" onClick={ (event) => {
                                    if(DepartureDate === "" || ReturnDate === "")
                                        alert("Please Enter a Depature Date and Return Date");
                                    else{
                                        this.renderFlightDatesData(event, DepartureDate, ReturnDate);
                                        //this.toggleFlights();
                                    }                                
                                }
                            }>Submit</Button>
                            </div>
                        </DropdownButton>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    </Form>
                </Navbar>
                {booleanButtonCase ? //mapping out flight data for the upcoming week, when button is pressed we map our data below
                <div className="div-container">
                    <Image src={FlightImage} style={ {height: "100%"}, {width: "100%"}, {opacity: "0.3"}} />
                    <Container className="container">
                        <Row>
                        {
                            FlightData.map( (flightInfos, i) => {
                            return <Col key={i} style={{padding: "2px"}, {margin: "3px"}}>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Body>
                                    <Card.Title>{flightInfos.flightInfo.departure_at.toString().slice(0,10)} -- {flightInfos.flightInfo.return_at.toString().slice(0,10)}</Card.Title>
                                        <Card.Text>
                                            <b>AirLine</b>: {flightInfos.flightInfo.airline}<br />
                                            <b>Flight Number</b>: {flightInfos.flightInfo.flight_number}<br />
                                            <b># of Stops</b>: {flightInfos.flightInfo.transfers}<br />
                                        </Card.Text>
                                        <b>Origin </b>: {flightInfos.flightInfo.origin}<br />
                                        <b>Destination </b>: {flightInfos.flightInfo.destination}<br />
                                        <b>Departure Time</b>: {flightInfos.flightInfo.departure_at.toString().slice(11, 19)}<br />
                                        <b>Return Time</b>: {flightInfos.flightInfo.return_at.toString().slice(11, 19)}<br />
                                        <b>Prices</b>: ${flightInfos.flightInfo.price}.00<br />
                                    </Card.Body>
                                </Card>
                            </Col>
                            })
                        }
                        </Row>
                    </Container>
                </div>
                : 
                <div>
                    <img src={FlightImage} alt="FlightsImage"></img>
                </div>
                }
          </React.Fragment>
        );
    }
}

export default FlightPage;
