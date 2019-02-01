import React, { Component } from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import {fromJS} from 'immutable';
import socketIOClient from 'socket.io-client';
import HelgaSearch from './components/helgaSearch';

import MAP_STYLE from './resources/helga-v1.json';
const MAPBOX_TOKEN = 'pk.eyJ1IjoicmVkZGluZ2siLCJhIjoiY2pyZDMwcTBoMG5scjN5cHNudDdoZ3RrdCJ9.5_Z7l1uC7vobSJOh3c9oUg';
  
const INITIAL_VIEW_STATE = {
    longitude: -77.0902091, latitude: 38.9977548,
    zoom: 11, maxZoom: 16, pitch: 45, bearing: 0
};

class Helga extends Component{
    constructor(props) {
        super(props);

        this.state = {
            defaultMapStyle: fromJS(MAP_STYLE)            
        }
        this.jadaQuery = this.jadaQuery.bind(this);
    }

    
    render(){ 
        const {viewState, controller = true, baseMap = true} = this.props;

        return(
            <div className="body-container helga-body">
                <div className="map-container">
                    <DeckGL layers={this._renderLayers()} initialViewState={INITIAL_VIEW_STATE}  viewState={viewState} controller={controller}>
                        {baseMap && (
                            <StaticMap reuseMaps mapStyle={this.state.defaultMapStyle} preventStyleDiffing={true} mapboxApiAccessToken={MAPBOX_TOKEN}>
                                <HelgaSearch searchQuery={this.jadaQuery}/>
                            </StaticMap>
                        )}
                    </DeckGL>
                </div>                
            </div>
        );        
    }

    componentDidMount(){
        let self = this; 
        try {
            self._animate();      
            //self.initSocket();
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
                    //var tmpId = (res.rID ? res.rID : "NA");                      
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
                "rId":self.props.jUser.userId,                  
                "input":query
            };
            /* [REMOVE] */
            //self.props.jConnect.localSock.emit('jada', dataMsg);                 
        }
        catch(ex){
            console.log(" [Helga] Error: ", ex);
        }        
    }

    _animate() {
        const {
          loopLength = 1800, // unit corresponds to the timestamp in source data
          animationSpeed = 30 // unit time per second
        } = this.props;
        const timestamp = Date.now() / 1000;
        const loopTime = loopLength / animationSpeed;
    
        this.setState({
          time: ((timestamp % loopTime) / loopTime) * loopLength
        });
        this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
    }

    _renderLayers() {
        const {buildings = null, trips = null, trailLength = 180} = this.props;
        return [];
    }
}

export default Helga;