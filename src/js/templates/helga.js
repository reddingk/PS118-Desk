import React, { Component } from 'react';
//import {StaticMap} from 'react-map-gl';
import MapGL, {Marker, FlyToInterpolator} from 'react-map-gl';

import DeckGL, {PolygonLayer} from 'deck.gl';
import {fromJS} from 'immutable';

import MAP_STYLE from './resources/helga-v1.json';
const MAPBOX_TOKEN = 'pk.eyJ1IjoicmVkZGluZ2siLCJhIjoiY2pyZDMwcTBoMG5scjN5cHNudDdoZ3RrdCJ9.5_Z7l1uC7vobSJOh3c9oUg';

/* Components */
import HelgaSearch from './components/helgaSearch';
import HelgaCityPin from './components/helgaCityPin';
import LoadSpinner from './components/loadSpinner';
import SocketConnect from './components/socketConnect';
var localSock = null;



class Helga extends Component{
    constructor(props) {
        super(props);

        this.state = {
            viewport: {
                latitude: 38.9977548,
                longitude: -77.0902091,
                zoom: 10,
                bearing: 0,
                pitch: 45
            },
            loading: false,
            cities:[]          
        }

        this.socketDeclaration = this.socketDeclaration.bind(this);
        this.defaultMapStyle = fromJS(MAP_STYLE);
        this.jadaQuery = this.jadaQuery.bind(this);
    }

    
    render(){ 
        const {viewport} = this.state;

        return(
            <div className="body-container helga-body">
                <SocketConnect baseUrl={this.props.jConnect.coreUrlBase} user={this.props.jUser} socketDeclaration={this.socketDeclaration}/>

                <div className="map-container">
                    <MapGL {...viewport} width="100%" height="100%" mapStyle={this.defaultMapStyle} onViewportChange={this._updateViewport} mapboxApiAccessToken={MAPBOX_TOKEN} >
                        { this.state.cities.map(this._renderCityMarker) }
                        <HelgaSearch searchQuery={this.jadaQuery}/>
                        { this.state.loading && <LoadSpinner userClass="helga" /> }
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
    socketDeclaration(tmpSock){
        var self = this;
        try {            
            tmpSock.on('jada', function(res){
                self._displayMapData(res.data);                      
            });
            localSock = tmpSock;
        }
        catch(ex){
            console.log("Error with socket declaration: ", ex);
        }
    }

    jadaQuery(query){
        var self = this;
        try {
            var dataMsg = {"rID":self.props.jUser.userId, "type":"phrase", "input":query };

            self.setState({loading: true});            
            localSock.emit('jada', dataMsg);                 
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
                self.setState({cities: pointList, loading:false});   
                
                // Set Zoom Loc
                var zoomLoc = {"lat":0, "lng":0};

                pointList.forEach(function(item){
                    zoomLoc.lng = zoomLoc.lng + item.longitude;
                    zoomLoc.lat = zoomLoc.lat + item.latitude;
                });

                self._goToViewport({latitude:zoomLoc.lat/pointList.length, longitude: zoomLoc.lng/pointList.length, zoom: (pointList.length > 1 ? 4 : 11)});
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

    _onViewportChange = viewport => this.setState({
        viewport: {...this.state.viewport, ...viewport}
    });

    _goToViewport = ({longitude, latitude, zoom}) => {
        this._onViewportChange({
          longitude, latitude, zoom,
          transitionInterpolator: new FlyToInterpolator(),
          transitionDuration: 3000
        });
    };
    

    _updateViewport = (viewport) => {
        this.setState({ viewport });
    }

}

export default Helga;