import React, {Component} from 'react';
import axios from 'axios';
import ConfigFile from '../config/default.json'; //location of Auth Configs used to access TravelPayouts API
import FlightPage from "./FlightPage";
import HotelPage from "./HotelPage";
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

const AuthAccess = ConfigFile.UserInfo.AuthToken;

export class HomePage extends Component {

    render(){
        return(
            <h1>This is the HomePage of the app!</h1>
        );
    }
}

export default HomePage