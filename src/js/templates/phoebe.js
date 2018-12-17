import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

const electron = window.require('electron');
const desktopCapturer = electron.desktopCapturer;

class Phoebe extends Component{
    constructor(props) {
        super(props);

        this.state = {
            jConnect: {},
            mainSrc: null,
            sourceList:[],
            imgObj:null,
            videoFilter: 'live'
        }

        this.filterList = {"faceRecognition":true, "faceMark": true, "edgeDetect":true};
        this.liveVideo = null;
        this.liveSnapshot = null;

        /* Functions */
        this.toggleSnapShot = this.toggleSnapShot.bind(this);
        this.toggleLiveVideo = this.toggleLiveVideo.bind(this);
        this.changeVideoSrc = this.changeVideoSrc.bind(this);
    }

    /* Socket */
   initSocket(){
        var self = this;
        try {
            if(self.props.jConnect.localSock == null){
                var socketQuery = "userid="+ self.props.jUser.userId +"&token="+self.props.jUser.token;

                self.props.jConnect.localSock = socketIOClient(self.props.jConnect.coreUrlBase, {query: socketQuery});
                self.state.imgObj = document.getElementById("filterVideo");
                // On socket connection
                self.props.jConnect.localSock.on('direct connection', function(res){
                    //console.log(" [Phoebe] Received Direct Connection"); 
                    //var tmpId = (res.rID ? res.rID : "NA");  
                    if(self.state.imgObj) {
                        self.state.imgObj.src = res.data;
                    }
                });
            }            
        }
        catch(ex){
            console.log("Error starting sock connection: ", ex);
        }
    }

    render(){        
        return(
            <div className="body-container phoebe-body">

                <div className="phoebe-ctrl src-ctrl">
                    <div className="ctrl-live" onClick={() => this.toggleLiveVideo(false, true)}><div className="ctrl-btn"></div></div>
                    <div className="ctrl-container">
                        {this.state.sourceList.map((item, i) =>
                            <div className={"ctrl-item" + (this.state.mainSrc === item.name ? " active" : "")} key={i}onClick={() => this.changeVideoSrc(item)}>{item.name}</div>
                        )}
                    </div>
                </div>                
                
                <div className="hex-view-container">
                    <div className="hex phoebe-view">
                        <div className="hexIn">
                            <div className="hexBody">
                                <div className="hex-body-container">
                                    <video id="video" className={(this.state.videoFilter === 'live'? "active": "inactive")}></video>      
                                    <img id="filterVideo" className={(this.state.videoFilter !== 'live'? "active": "inactive")} alt="pheobe filtered video" src=""></img>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="phoebe-ctrl filter-ctrl">
                    <div className="ctrl-container">
                        {Object.keys(this.filterList).map((item, i) =>
                            <div className={"ctrl-item" + (this.state.videoFilter === item ? " active" : "")} key={i}onClick={() => this.toggleSnapShot(item)}>{item}</div>
                        )}
                    </div>
                </div>    
            </div>
        );        
    }


    /* Components Hooks */
    componentDidMount(){
        let self = this;    

        try {
            desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
                if (error) throw error
                if(sources) { sources.unshift({"name":"live", "id":0})};

                self.setState({ sourceList: sources });
            });
            self.initSocket();     
        }  
        catch(ex){
            console.log(" [Phoebe] Error: ", ex);
        }
    }

    /* Change Video SRC*/
    changeVideoSrc(newSrc){
        var self = this;
        var filterStatus = (self.state.videoFilter !== 'live');

        try {            
            // stop live video
            self.liveVideo.stop();
            clearInterval(self.liveSnapshot);

            // update video src
            self.state.mainSrc = newSrc.name;
            
            // toggle live with new src
            var videoSrc = (newSrc && newSrc.name === "live" ? true : { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: newSrc.id}});
            self.toggleLiveVideo(false, videoSrc);

            // if filter was on re-enable
            if(filterStatus) { self.toggleSnapShot(self.state.videoFilter); }
        }
        catch(ex){
            console.log(" [Phoebe] changing src error: ", ex);
        }
    }

    /* Start Main Video */
    toggleLiveVideo(audioSettings, videoSettings){
        var self = this;
        try{
            if(self.liveVideo == null || !self.liveVideo.getSettings().frameRate) {
                self.setState({ videoFilter: "live", mainSrc: "live" });

                navigator.mediaDevices.getUserMedia({
                    audio: audioSettings,
                    video: videoSettings
                })
                .then((stream) => {
                    const video = document.querySelector('video');
                    video.srcObject = stream;
                    self.liveVideo = stream.getTracks()[0];
                    video.onloadedmetadata = (e) => video.play(); 
                })
                .catch((e) => {console.log(e);})
            }
            else {
                self.liveVideo.stop();
                clearInterval(self.liveSnapshot);
                const video = document.querySelector('video');
                video.srcObject = null;
                self.setState({ mainSrc: null });
            }
        }
        catch(ex){
            console.log(" [Phoebe] Error starting video: ", ex);
        }
    }

    /* Get Snapshot of main video */
    getSnapShot(){
        var ret = null;

        try {
            var video = document.querySelector('video'), canvas, context;
            if(video) {
                var width = video.offsetWidth, height = video.offsetHeight;

                canvas = canvas || document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, width, height);

                ret = canvas.toDataURL('image/png');
            }
        }
        catch(ex){
            console.log(" [Phoebe] Error getting video snapshot: ", ex);
        }

        return ret;
    }

    /* Toggle Snapshot */
    toggleSnapShot(filter){
        var self = this;
        try {
            if(self.liveSnapshot != null){
                clearInterval(self.liveSnapshot);
                self.liveSnapshot = null;
                
                if(filter === self.state.videoFilter){
                    self.setState({ videoFilter: 'live' });
                }
                else {
                    self.toggleSnapShot(filter);
                }
            }
            else {
                if(filter != null && (filter in self.filterList)){
                    this.setState({ videoFilter: filter });
                    self.liveSnapshot = setInterval(function() { 
                        var tmpSnapShot = self.getSnapShot();                        
                        // Send Snap to Jada
                        var dataMsg = {
                            "rId":self.props.jUser.userId, 
                            "command":"pheobeView", 
                            "filter":filter, 
                            "filterStatus":true, 
                            "data":tmpSnapShot
                        };

                        self.props.jConnect.localSock.emit('direct connection', {"sID":self.props.jUser.userId, "data":dataMsg});
                    }, 180);
                }
            }
        }
        catch(ex){
            console.log(" [Phoebe] Error toggling video snapshot: ", ex);
        }
    }
}

export default Phoebe;