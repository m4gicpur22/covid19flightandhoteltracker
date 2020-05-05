import React, { Component } from 'react';
import '../src/CSSsheets/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./Components/NavBar.js";

class App extends Component {
  render() {
    return (
        <React.Fragment>
          <div>
            <NavBar />
          </div>
        </React.Fragment>
    );
  }
}

export default App;
