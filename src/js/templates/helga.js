import React, { Component } from 'react';
//import {StaticMap} from 'react-map-gl';
import MapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';

import DeckGL, {PolygonLayer} from 'deck.gl';
import {fromJS} from 'immutable';
import socketIOClient from 'socket.io-client';
import HelgaSearch from './components/helgaSearch';
import HelgaCityPin from './components/helgaCityPin';

import MAP_STYLE from './resources/helga-v1.json';
const MAPBOX_TOKEN = 'pk.eyJ1IjoicmVkZGluZ2siLCJhIjoiY2pyZDMwcTBoMG5scjN5cHNudDdoZ3RrdCJ9.5_Z7l1uC7vobSJOh3c9oUg';

class Helga extends Component{
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                latitude: 38.9977548,
                longitude: -77.0902091,
                zoom: 3.5,
                bearing: 0,
                pitch: 45
            },
            cities:[]          
        }
        this.defaultMapStyle = fromJS(MAP_STYLE);
        this.jadaQuery = this.jadaQuery.bind(this);
    }

    
    render(){ 
        const {viewport} = this.state;

        return(
            <div className="body-container helga-body">
                <div className="map-container">
                    <MapGL {...viewport} width="100%" height="100%" mapStyle={this.defaultMapStyle} onViewportChange={this._updateViewport} mapboxApiAccessToken={MAPBOX_TOKEN} >
                        { this.state.cities.map(this._renderCityMarker) }
                        <HelgaSearch searchQuery={this.jadaQuery}/>
                    </MapGL>
                </div>                
            </div>
        );        
    }

    componentDidMount(){
        let self = this; 
        try {
            // [REMOVE]     
            self.initSocket();
        }
        catch(ex){
            console.log(" [Helga] Error: ", ex);
        }
    }

    componentWillUnmount() {
        if (this._animationFrame) {
          window.cancelAnimationFrame(this._animationFrame);
        }
    }
    /* Socket */
    initSocket(){
        var self = this;
        try {
            if(self.props.jConnect.localSock == null){
                var socketQuery = "userid="+ self.props.jUser.userId +"&token="+self.props.jUser.token;

                self.props.jConnect.localSock = socketIOClient(self.props.jConnect.coreUrlBase, {query: socketQuery});                
                // On socket connection
                self.props.jConnect.localSock.on('jada', function(res){
                    console.log(" [Helga] Received Map Connection"); 
                    console.log(res);
                    self._displayMapData(res.data);                      
                });
            }            
        }
        catch(ex){
            console.log("Error starting sock connection: ", ex);
        }
    }

    jadaQuery(query){
        var self = this;
        try {
            console.log("Searching Query: ", query);
            var dataMsg = {
                "rID":self.props.jUser.userId,   
                "type":"phrase", 
                "input":query
            };

            /* [REMOVE] */
            self.props.jConnect.localSock.emit('jada', dataMsg);                 
        }
        catch(ex){
            console.log(" [Helga] Error: ", ex);
        }        
    }

    _displayMapData(data){
        var self = this;

        try {
            if(data && data.jtype == "map"){
                var pointList = [];
                data.jdata.results.forEach(function(country){
                    // Country Capital
                    if(self._chkLngLat(country.capital.coordinates)) { pointList.push({"name":country.capital.name,"type":"countryCapital", "latitude":country.capital.coordinates.lat, "longitude":country.capital.coordinates.lng}); }
                    
                    // State Capitals
                    if(country.states){
                        country.states.forEach(function(state){
                            if(self._chkLngLat(state.capital.coordinates)) { pointList.push({"name":state.capital.name,"type":"stateCapital", "latitude":state.capital.coordinates.lat, "longitude":state.capital.coordinates.lng}); }

                            // State Cities
                            if(state.cities){
                                state.cities.forEach(function(city){
                                    //if(_chkLngLat(city.coordinates)) { pointList.push({"name":city.name,"type":"stateCity", "latitude":city.coordinates.lat, "longitude":city.coordinates.lng}); }
                                });
                            }
                        });  
                    }                  
                });

                console.log("Set City List: ", pointList);
                self.setState({cities: pointList});                
            }
        }
        catch(ex){
            console.log(" [Helga]: error displaying map data: ", ex);
        }
    }

    _chkLngLat(coordinates){
        return (coordinates.lng & coordinates.lat);
    }
    _renderCityMarker = (city, index) => {
        return (
          <Marker key={`marker-${index}`} longitude={city.longitude} latitude={city.latitude} >
            <HelgaCityPin size={20} />
          </Marker>
        );
    }

    _updateViewport = (viewport) => {
        this.setState({ viewport });
    }

}

export default Helga;