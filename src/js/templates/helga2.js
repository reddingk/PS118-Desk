import React, { Component } from 'react';
import { loadModules } from 'esri-loader';


/* Components */
import MAP_STYLE from './resources/helga-v2.json';
import HelgaSearch from './components/helgaSearch';
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
        this.addPoint = this.addPoint.bind(this);
        this.socketDeclaration = this.socketDeclaration.bind(this);
        this.jadaQuery = this.jadaQuery.bind(this);

        this.mapRef = React.createRef();
    }

    
    render(){ 
        return(
            <div className="body-container helga-body">
                <SocketConnect baseUrl={this.props.jConnect.coreUrlBase} user={this.props.jUser} socketDeclaration={this.socketDeclaration}/>
                <div className="map-container">
                    { this.state.loading && <LoadSpinner userClass="helga" /> }
                    <HelgaSearch searchQuery={this.jadaQuery}/>
                    <div className="arcMap" ref={this.mapRef} />
                </div>
            </div>
        );        
    }

    componentDidMount(){
        this.loadMaps();
    }

    componentWillUnmount() {}

    loadMaps(){
        var self = this;
        loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/VectorTileLayer', 'esri/layers/GraphicsLayer'], { css: true }) 
        .then(([ArcGISMap, MapView, VectorTileLayer, GraphicsLayer]) => {
            //const map = new ArcGISMap({ basemap: 'dark-gray' });
            const map = new ArcGISMap();
            
            const vtLayer = new VectorTileLayer({style: MAP_STYLE});
            this.graphicsLayer = new GraphicsLayer();

            map.add(vtLayer);
            map.add(this.graphicsLayer);

            this.view = new MapView({
              container: this.mapRef.current,
              map: map,
              center: self.state.center,
              zoom: self.state.zoom
            });
          });
    }

    addPoint(dataPoint){
        var self = this;

       try {

            loadModules(['esri/Graphic']) 
            .then(([Graphic]) => {
                var point = { type: "point", longitude: dataPoint.longitude, latitude: dataPoint.latitude };

                var simpleMarkerSymbol = { type: "simple-marker",
                    color: [231, 113, 125], outline: { color: [255, 255, 255], width: 1 }
                };

                var pointGraphic = new Graphic({ geometry: point, symbol: simpleMarkerSymbol });

                this.graphicsLayer.add(pointGraphic);
            });
        }
        catch(ex){
            console.log("Error Adding Point: ",ex);
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

    // private functions
    _displayMapData(data){
        var self = this;
        try {
            if(data && data.jtype === "map"){ 
                var pointList = [];
                var tmpPt = {};

                data.jdata.results.forEach(function(country){
                    // Country Capital
                    if(self._chkLngLat(country.capital.coordinates)) 
                    {
                        tmpPt = {"name":country.capital.name,"type":"countryCapital", "latitude":country.capital.coordinates.lat, "longitude":country.capital.coordinates.lng};
                        self.addPoint(tmpPt); 
                        pointList.push(tmpPt);
                    }
                    
                    // State Capitals
                    if(country.states){
                        country.states.forEach(function(state){
                            if(self._chkLngLat(state.capital.coordinates)) 
                            { 
                                tmpPt = {"name":state.capital.name,"type":"stateCapital", "latitude":state.capital.coordinates.lat, "longitude":state.capital.coordinates.lng};
                                self.addPoint(tmpPt); 
                                pointList.push(tmpPt); 
                            }
                            // State Cities
                        });
                    }
                });

                // Set Zoom Loc
                var zoomLoc = {"lat":0, "lng":0};

                pointList.forEach(function(item){
                    zoomLoc.lng = zoomLoc.lng + item.longitude;
                    zoomLoc.lat = zoomLoc.lat + item.latitude;
                });

                if(pointList.length > 0) {
                    self._goToViewport(zoomLoc.lng/pointList.length, zoomLoc.lat/pointList.length, (pointList.length > 1 ? 4 : 11));
                }
            }

            self.setState({loading:false});
        }
        catch(ex){
            console.log(" [Helga]: error displaying map data: ", ex);
        }
    }

    _chkLngLat(coordinates){
        return (coordinates.lng & coordinates.lat);
    }

    _goToViewport(longitude, latitude, zoom) {
        this.view.center = [longitude, latitude];
        this.view.zoom = zoom;
    }
}

export default Helga;