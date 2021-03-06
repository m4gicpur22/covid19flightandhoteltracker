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
    DropdownButton,
    Image
} from "react-bootstrap";
import HotelImage from '../PNGFiles/allen-dewberry-jr-XjKiG46fkQI-unsplash.jpg';
import '../CSSsheets/Travels.css';
import { Rating } from '@material-ui/lab';
import SearchBar from '../Components/SearchBar.js';

const AuthAccess = ConfigFile.UserInfo.AuthToken;

export class HotelPage extends Component {

    constructor(props){
        super(props)
        this.state = {
            USACityCodes: [],
            HotelData: [],
            defaultToken: AuthAccess,
            CheckIn: "",
            CheckOut: "",
            CityInput: "",
            CityCode: "",
            hotelbooleancase: false,
            TotalNumberofBookingDays: 0,
            FilteredHotels: []
        };
        this.renderHotelData = this.renderHotelData.bind(this);
        this.handleButtonSubmit = this.handleButtonSubmit.bind(this);
        this.revealHotelInfo = this.revealHotelInfo.bind(this);
        this.FilteredHotelData = this.FilteredHotelData.bind(this);
    }

    FilteredHotelData(FilteredData) {
        console.log("The new Hotel Data recevied back is:" + JSON.stringify(FilteredData) );
        this.setState({FilteredHotels: FilteredData});
    }

    revealHotelInfo() {
        this.setState({
            hotelbooleancase: true
        });
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

    async renderHotelData(CityCode){

        const HotelData = [];
        const {defaultToken, CheckIn, CheckOut} = this.state;
        let config = { //need to fix cors issues later
            headers: {
                "x-access-token" : defaultToken,
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Encoding": "gzip",
                "Access-Control-Allow-Origin": "*"
            }
        }

        let res = await axios.get(`http://engine.hotellook.com/api/v2/cache.json?location=${CityCode}&checkIn=${CheckIn}&checkOut=${CheckOut}&currency=USD`, config);
        let HotelInfo = res.data;

        console.log("Data is: " + JSON.stringify(HotelInfo));

        for(let i = 0; i < HotelInfo.length; i++){
            var HotelObject = {PriceAverage: "", HotelId:"", stars: 0, HotelName: "", CityName: "", State: "", Country: ""};
            HotelObject["HotelId"] = HotelInfo[i].hotelId;
            HotelObject["PriceAverage"] = HotelInfo[i].priceAvg;
            HotelObject["stars"] = HotelInfo[i].stars;
            HotelObject["HotelName"] = HotelInfo[i].hotelName;
            HotelObject["CityName"] = HotelInfo[i].location.name;
            HotelObject["Country"] = HotelInfo[i].location.country;
            HotelObject["State"] = HotelInfo[i].location.state;
            HotelData.push(HotelObject);
        }

        this.setState({HotelData: HotelData});
    }

    handleButtonSubmit(event) {

        event.preventDefault();
        const{CityInput, USACityCodes} = this.state;
        var CityCode = "";

        if(CityInput === "") //want this to return an alert to the screen
            console.log("Please Enter a City!");

        for(let i = 0; i < USACityCodes.length; i++){
            if(CityInput.toLowerCase() === USACityCodes[i].CityName.toLowerCase()){
                console.log("Associated City Code: " + USACityCodes[i].CityCode);
                CityCode = USACityCodes[i].CityCode;
            }
        }

        this.setState({CityCode: CityCode});
        this.renderHotelData(CityCode);
    }

    render(){
        
        const {hotelbooleancase, HotelData, CheckIn, CheckOut, CityInput, TotalNumberofBookingDays, FilteredHotels} = this.state;
        var NavBarClassName = !hotelbooleancase ? "NavBar" : "NavBar-NotFixed";
        var HotelArray = FilteredHotels.length > 0 ? FilteredHotels : HotelData;

        return(
        <React.Fragment>
            <Navbar bg="dark" variant="dark" className={NavBarClassName}>
                <Navbar.Brand onClick={ () => {
                        window.location.reload(true);
                        //this.setState({hotelbooleancase: false});
                        }
                    }>CovidTravel</Navbar.Brand>
                <Nav className="mr-auto">
                    <Button variant="outline-info" href="/" style={ {padding: "5px"}, {margin: "5px"}} >Home</Button>
                    <DropdownButton variant="outline-info" id="dropdown-item-button" title="Hotels for the Month" style={ {padding: "5px"}, {margin: "5px"}}>
                        <Form>
                            <Form.Group controlId="formGroupEmail" className="InputForm">
                                <Form.Label className="InputText">City</Form.Label>
                                <Form.Control style={{textAlign: "center"}} type="text" placeholder="City" onChange={ (e) => {
                                        this.setState({CityInput: e.target.value});
                                        }
                                    }/>
                            </Form.Group>
                            <Form.Group controlId="formGroupEmail" className="InputForm">
                                <Form.Label className="InputText">Check-in Date</Form.Label>
                                <Form.Control style={{textAlign: "center"}} type="text" placeholder="Check-in Date" onChange={ (e) => {
                                        this.setState({CheckIn: e.target.value});
                                        }
                                    }/>
                            </Form.Group>
                            <Form.Group controlId="formGroupEmail" className="InputForm">
                                <Form.Label className="InputText" >Check-Out Date</Form.Label>
                                <Form.Control style={{textAlign: "center"}} type="text" placeholder="Check-Out Date" onChange={ (e) => {
                                        this.setState({CheckOut: e.target.value});
                                        }
                                    }/>
                            </Form.Group>
                        </Form>
                        <div className="Button-Div">
                        <Button variant="info" onClick={ (event) => {
                                if(CheckIn === "" || CheckOut === "" || CityInput === "")
                                    alert("Please enter a City and Booking Dates!");
                                else {
                                    let StartBookingDate = new Date(CheckIn);
                                    let EndBookingDate = new Date(CheckOut);
                                    let numberofBookingDays = ( (EndBookingDate.getTime() - StartBookingDate.getTime() ) / ( 24*60*60*1000 ) ) + 1;
                                    console.log("Number of total booking days: " + numberofBookingDays);
                                    this.setState({TotalNumberofBookingDays: numberofBookingDays});
                                    this.handleButtonSubmit(event);
                                    this.revealHotelInfo();
                                }
                            }
                        }>Submit</Button>
                        </div>
                    </DropdownButton>
                </Nav>
                {HotelData.length > 0 ? <SearchBar TrackerData={HotelData} FilteredData={this.FilteredHotelData} /> : ""}
            </Navbar>
            {hotelbooleancase ?                                                            
            <div className="div-container2">
                <Image src={HotelImage} style={ {height: "100%"}, {width: "100%"}, {opacity: "0.3"}} />
                <Container className="container2">
                    <Row>
                    {
                        HotelArray.map( (HotelInfos, i) => {
                            return <Col key={i} style={{padding: "10px"}, {margin: "10px"}}>
                                <Card style={{ width: '18em' }}>
                                    <Card.Body>
                                        <Card.Title>{HotelInfos.HotelName}</Card.Title>
                                            <Card.Text>
                                                {CheckIn} to {CheckOut} <br />
                                                <br />
                                                <i>{HotelInfos.Country}</i> <br />
                                                <i>{HotelInfos.CityName}, {HotelInfos.State}</i> <br />
                                            </Card.Text>
                                        ${ ( (HotelInfos.PriceAverage)/(TotalNumberofBookingDays) ).toFixed(2) } per day <br />
                                        <b>Total: </b> ${HotelInfos.PriceAverage.toFixed(2)} <br />
                                        <Rating name="half-rating-read" defaultValue={HotelInfos.stars} precision={0.5} readOnly /> <br />
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
                <img src={HotelImage} style={ {height: "100%"}, {width: "100%"} } alt="HotelImage"></img>
            </div>
            }
        </React.Fragment>
        );
    }
}

export default HotelPage;