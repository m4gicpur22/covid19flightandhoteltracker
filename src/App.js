import React, { Component } from 'react';
import '../src/CSSsheets/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FlightPage from "./Components/FlightPage.js";
import HotelPage from "./Components/HotelPage.js";
import Homepage from "./Components/HomePage.js";
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

class App extends Component {

  render() {
    return ( //General Home Page - Flights Page - Hotel Page - Car Rentals(possibly)
    <Router>
      <div>
        <Switch>
          <Route path="/Hotels">
            <HotelPage />
          </Route>
          <Route path="/Flights">
            <FlightPage />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
    );
  }
}

export default App;
