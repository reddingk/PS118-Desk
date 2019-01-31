import React, { Component } from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL, {PolygonLayer} from 'deck.gl';
import {fromJS} from 'immutable';

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
    }

    
    render(){ 
        const {viewState, controller = true, baseMap = true} = this.props;

        return(
            <div className="body-container helga-body">
                <div className="map-container">
                    <DeckGL layers={this._renderLayers()} initialViewState={INITIAL_VIEW_STATE}  viewState={viewState} controller={controller}>
                        {baseMap && (
                            <StaticMap reuseMaps mapStyle={this.state.defaultMapStyle} preventStyleDiffing={true} mapboxApiAccessToken={MAPBOX_TOKEN}>
                                <div className="searchDemo"></div>
                            </StaticMap>
                        )}
                    </DeckGL>
                </div>                
            </div>
        );        
    }

    componentDidMount(){
        let self = this; 
        self._animate();      
    }

    componentWillUnmount() {
        if (this._animationFrame) {
          window.cancelAnimationFrame(this._animationFrame);
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