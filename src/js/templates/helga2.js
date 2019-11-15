import React, { Component } from 'react';
import { loadModules } from 'esri-loader';

/* Components */
import LoadSpinner from './components/loadSpinner';
import SocketConnect from './components/socketConnect';

var localSock = null;

class Helga extends Component{
    constructor(props) {
        super(props);

        this.state = {
            center:[-77.0902091,38.9977548],
            zoom: 10,            
            loading: false,
            cities:[]          
        }

        this.loadMaps = this.loadMaps.bind(this);
        this.mapRef = React.createRef();
    }

    
    render(){ 
        return(
            <div className="body-container helga-body">
                <div className="arcMap" ref={this.mapRef}></div>
            </div>
        );        
    }

    componentDidMount(){
        this.loadMaps();
    }

    componentWillUnmount() {}

    loadMaps(){
        var self = this;
        loadModules(['esri/Map', 'esri/views/MapView'], { css: true }) 
        .then(([ArcGISMap, MapView]) => {
            const map = new ArcGISMap({ basemap: 'dark-gray' });
      
            this.view = new MapView({
              container: this.mapRef.current,
              map: map,
              center: self.state.center,
              zoom: self.state.zoom
            });
          });
    }
}

export default Helga;