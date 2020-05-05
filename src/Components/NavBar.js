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
    Col
} from "react-bootstrap";
import axios from 'axios';
import ConfigFile from '../config/default.json'; //location of Auth Configs used to access TravelPayouts API

const AuthAccess = ConfigFile.UserInfo.AuthToken;

export class NavBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            monthyFlightData: [],
            USACityCodes: [],
            booleanButtonCase: false,
            defaultoken: AuthAccess
        };
        this.toggleWeeklyFlights = this.toggleWeeklyFlights.bind(this);
        this.renderweeklyFlightDate = this.renderweeklyFlightDate.bind(this);
    }

    toggleWeeklyFlights() {
        this.setState({
            booleanButtonCase: !this.state.booleanButtonCase
        });
    }

    //obtaining all USA city codes before mounting data begins
    async componentWillMount() {
        //this function is going to get all the USA city codes from the travelpayouts API

        const CityCodes = [];

        let res = await axios.get(`https://api.travelpayouts.com/data/en/cities.json`);
        let CitiesData = res.data;

        for(let i in CitiesData){
            var citiesObject = {CityCode: "", CountryCode: ""};
            citiesObject["CityCode"] = CitiesData[i].code;
            citiesObject["CountryCode"] = CitiesData[i].country_code;
            if(citiesObject["CountryCode"] === "US")
                CityCodes.push(citiesObject);
        }
        //console.log("This is the list of data within the API call: " + JSON.stringify(res.data))
        console.log("Length of this API data is " + CitiesData.length);

        this.setState({USACityCodes: CityCodes});

    }

    async renderweeklyFlightDate() {

        //axios call to obtain flight data for the upcoming month from USA
        //we are going to start by parsing data within United States

        const flightData = [];

        let config = { //need to fix cors issues later
            headers: {
                "x-access-token" : this.state.defaultoken,
                "Content-Type" : "application/x-www-form-urlencoded"
            }
        }

        var USCities = this.state.USACityCodes;
        const NumberofUSCities = this.state.USACityCodes.length;

        //current api for month of may airlines from orlando to new york
        //make this total data from all USA flights for the month
        //console.log(USCities); 
        //496 represents MIA Origin and 504 represents NYC destination
        let res = await axios.get(`https://api.travelpayouts.com/v1/prices/calendar?depart_date=2020-05&origin=${USCities[496].CityCode}&destination=${USCities[504].CityCode}&calendar_type=departure_date&currency=USD`, config);
        
        for(let [key, values] of Object.entries(res.data.data) ) {
            var flightobject = {flightDates: "", flightInfo:""};
            console.log(`Keys are : ${key} and Values are ` + JSON.stringify(values));
            flightobject["flightDates"] = key;
            flightobject["flightInfo"] = values;
            flightData.push(flightobject);
        }                   

        //console.log("This is the list of data within the API call: " + JSON.stringify(res.data));
        this.setState( {monthyFlightData: flightData} );
    }

    render() {

        return(
            <React.Fragment>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand onClick={ () => window.location.reload(true) }>FlightandHotel Tracker</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Button variant="outline-info" style={ {padding: "5px"}, {margin: "5px"} } onClick={ () => {
                            this.renderweeklyFlightDate(); 
                            this.toggleWeeklyFlights();
                            }
                        }>Flights for the Month</Button>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    </Form>
                </Navbar>
                {this.state.booleanButtonCase ? //mapping out flight data for the upcoming week, when button is pressed we map our data below
                <Container>
                    <Row>
                    {
                        this.state.monthyFlightData.map( (flightInfos, i) => {
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

export default NavBar;