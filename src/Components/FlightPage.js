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
    DropdownButton
} from "react-bootstrap";
import axios from 'axios';
import ConfigFile from '../config/default.json'; //location of Auth Configs used to access TravelPayouts API

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
            DepartureDate: "",
            ReturnDate: ""
        };
        this.toggleFlights = this.toggleFlights.bind(this);
        this.renderMonthlyFlightDate = this.renderMonthlyFlightDate.bind(this);
        this.handleButtonSubmit = this.handleButtonSubmit.bind(this);
        this.handleDates = this.handleDates.bind(this);
        this.renderFlightDatesData = this.renderFlightDatesData.bind(this);
    }

    toggleFlights() {
        this.setState({
            booleanButtonCase: !this.state.booleanButtonCase
        });
    }

    handleButtonSubmit(event) {

        const{OriginState, DestinationState, USACityCodes} = this.state;

        var OriginCityCode = "";
        var DestinationCityCode = "";
        
        event.preventDefault();
        
        console.log("Our Origin is : " + OriginState);
        console.log("Our Destination is : " + DestinationState);

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

        console.log("Origin City Code is " + OriginCityCode);
        console.log("Destination City Cide is " + DestinationCityCode);

        //passing City Codes through
        this.renderMonthlyFlightDate(OriginCityCode, DestinationCityCode);
    }

    handleDates(event) {

        var DepartureDate = this.state.DepartureDate;
        var ReturnDate = this.state.ReturnDate;

        //function is going to translate input dates into date object

        console.log("This is the handleDates function");

        this.renderFlightDatesData(DepartureDate, ReturnDate);
    }

    //obtaining all USA city codes before mounting data begins
    async componentWillMount() {
        //this function is going to get all the USA city codes from the travelpayouts API

        const CityCodes = [];

        let res = await axios.get(`https://api.travelpayouts.com/data/en/cities.json`);
        let CitiesData = res.data;

        for(let i in CitiesData){
            var citiesObject = {CityCode: "", CountryCode: "", CityName: ""};
            citiesObject["CityCode"] = CitiesData[i].code;
            citiesObject["CountryCode"] = CitiesData[i].country_code;
            citiesObject["CityName"] = CitiesData[i].name;
            if(citiesObject["CountryCode"] === "US")
                CityCodes.push(citiesObject);
        }
        //console.log("This is the list of data within the API call: " + JSON.stringify(res.data))
        //console.log("Length of this API data is " + CitiesData.length);

        this.setState({USACityCodes: CityCodes});

    }

    async renderFlightDatesData(DepartureDate, ReturnDate){

        const FlightData = [];

        //this function is gonna analyze dates taken by the user and show flights between departure date and return date given by the user
        
        let config = { //need to fix cors issues later
            headers: {
                "x-access-token" : this.state.defaultoken,
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Encoding": "gzip"
            }
        }

        let res = await axios.get(`https://api.travelpayouts.com/v1/prices/calendar?depart_date=2020-05-09&return_date=2020-05-11&origin=MIA&destination=NYC&calendar_type=departure_date&currency=USD`, config);

        console.log("The data shown is " + res.data.data);

        //this.setState({FlightData: FlightData})

    }

    async renderMonthlyFlightDate(Origin, Destination) {

        //axios call to obtain flight data for the upcoming month from USA
        //we are going to start by parsing data within United States

        const currentMonthflightData = [];

        let config = { //need to fix cors issues later
            headers: {
                "x-access-token" : this.state.defaultoken,
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Encoding": "gzip"
            }
        }

        var USCities = this.state.USACityCodes;
        const NumberofUSCities = this.state.USACityCodes.length;

        //current api for month of may airlines from orlando to new york
        //make this total data from all USA flights for the month
        //496 represents MIA Origin and 504 represents NYC destination

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

        const{FlightData, booleanButtonCase} = this.state;

        return(
            <React.Fragment>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand onClick={ () => window.location.reload(true) }>FlightandHotel Tracker</Navbar.Brand>
                    <Nav className="mr-auto">
                        <DropdownButton variant="outline-info" id="dropdown-item-button" title="Flights for the Month" style={ {padding: "5px"}, {margin: "5px"}}>
                            <Form>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label>Origin</Form.Label>
                                    <Form.Control type="text" placeholder="Origin" onChange={ (e) => {
                                        this.setState({OriginState: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword">
                                    <Form.Label>Destination</Form.Label>
                                    <Form.Control type="text" placeholder="Destination" onChange={ (e) => {
                                            this.setState({DestinationState: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                            </Form>
                            <Button variant="info" onClick={ (event) => {
                                this.handleButtonSubmit(event);
                                this.toggleFlights();
                                }
                            }
                            >Submit</Button>
                        </DropdownButton>
                        <DropdownButton variant="outline-info" id="dropdown-item-button" title="Flights Tickets" style={ {padding: "5px"}, {margin: "5px"}}>
                            <Form>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label>Departure Date</Form.Label>
                                    <Form.Control type="text" placeholder="Departure Date" onChange={ (e) => {
                                        this.setState({DepartureDate: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword">
                                    <Form.Label>Return Date</Form.Label>
                                    <Form.Control type="text" placeholder="Return Date" onChange={ (e) => {
                                            this.setState({ReturnDate: e.target.value});
                                        }
                                    }
                                    />
                                </Form.Group>
                            </Form>
                            <Button variant="info" onClick={ (event) => {
                                    this.handleDates(event);
                                }
                            }>Submit</Button>
                        </DropdownButton>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    </Form>
                </Navbar>
                {booleanButtonCase ? //mapping out flight data for the upcoming week, when button is pressed we map our data below
                <Container>
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
                                        <b># of Stops</b> : {flightInfos.flightInfo.transfers}<br />
                                    </Card.Text>
                                    <b>Origin: </b> {flightInfos.flightInfo.origin} <br />
                                    <b>Destination: </b> {flightInfos.flightInfo.destination} <br />
                                    <b>Departure Time:</b> {flightInfos.flightInfo.departure_at.toString().slice(11, 19)}<br />
                                    <b>Return Time:</b> {flightInfos.flightInfo.return_at.toString().slice(11, 19)}<br />
                                    <b>Prices:</b> ${flightInfos.flightInfo.price}.00<br />
                                </Card.Body>
                            </Card>
                        </Col>
                        })
                    }
                    </Row>
                </Container>
                : "" }
          </React.Fragment>
        );
    }
}

export default FlightPage;