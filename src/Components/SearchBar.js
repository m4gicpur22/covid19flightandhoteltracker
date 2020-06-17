import React, {useState, useEffect} from 'react';
import {
    Form,
    FormControl,
} from "react-bootstrap";

const SearchBar = ({TrackerData, FilteredData=f=>f}) => {

    const [search, setSearch] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    //algorithm that will filter by search when input is typed in box
    //updates every time some input is typed in due to onChange event
    useEffect( () => {

        //console.log("Our URL is: " + window.location.href);
        var DataPage = window.location.href;

        if(DataPage.toString().includes('Flights')){
            console.log("Our data is:" + JSON.stringify(TrackerData) );
            setFilteredData(
                TrackerData.filter( (Flights) => {
                    return Flights.flightInfo.price.toString().toLowerCase().includes(search.toLowerCase());
                })
            );
        }
        else if(DataPage.toString().includes('Hotels')){
            console.log("Our data is:" + JSON.stringify(TrackerData) );
            setFilteredData(
                TrackerData.filter( (Hotels) => {
                    return Hotels.HotelName.toLowerCase().includes(search.toLowerCase());
                })
            )
        }

    }, [search, TrackerData]);

    return(
        <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={ (e) => {
                    setSearch(e.target.value);
                    FilteredData(filteredData);
                    } 
                }
            />
        </Form>
    );

}

export default SearchBar;