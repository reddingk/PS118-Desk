import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Login extends Component{
   constructor(props) {
      super(props);
      this.state = {
        loginSock: null,
        videoFilter: null,
        loginAttempts: 0,
        attemptMax: 10,
        type: null,
        userId: '',
        name: null,
        password: '',
        ctrlTxt: null
      };

      this.liveVideo = null;
      this.liveSnapshot = null;

      this.toggleLiveVideo = this.toggleLiveVideo.bind(this);
      this.userLogin = this.userLogin.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
   }

   toggleLiveVideo(audioSettings, videoSettings){
        var self = this;
        try {
            if(self.liveVideo == null || !self.liveVideo.getSettings().frameRate) {
                self.setState({ videoFilter: "live"});

                navigator.mediaDevices.getUserMedia({
                    audio: audioSettings,
                    video: videoSettings
                })
                .then((stream) => {
                    const video = document.querySelector('video');
                    video.srcObject = stream;
                    self.liveVideo = stream.getTracks()[0];
                    video.onloadedmetadata = (e) => video.play(); 
                    
                    setTimeout(function(){
                        // Initiate Socket
                        self.initSocket();
                        
                        // Authorize Snapshot
                        self.setState({ ctrlTxt: null });
                        self.authSnapshot();
                    }, 500);
                })
                .catch((e) => {console.log(e);})
            }
            else {
                self.liveVideo.stop();
                clearInterval(self.liveSnapshot);
            }
        }
        catch(ex){
            console.log(" [Login] Error starting video: ", ex);
        }
   }


   /* Socket */
   initSocket(){
        var self = this;
        try {
            if(self.state.loginSock == null){
                self.state.loginSock = socketIOClient(self.props.jConnect.coreUrlBase, {query: "userid="});
                // On socket connection
                self.state.loginSock.on('jauth', function(res){  
                    self.handleJAuth(res);
                });
            }            
        }
        catch(ex){
            console.log("Error starting sock connection: ", ex);
        }
   }

   handleJAuth(res){
        var self = this;
        try {
            if(res && res.type){
                switch(res.type){
                    case "faceMatch":
                        if(res.data.userId){
                            self.setState({ userId: res.data.userId });
                            self.setState({ name: res.data.name });

                            self.setState({ ctrlTxt: "Welcome " + res.data.name+ " Enter Your Password" });

                            self.liveVideo.stop();
                            const video = document.querySelector('video');
                            video.srcObject = null;   
                            clearInterval(self.liveSnapshot);
                        }
                        else if(!res.data.userId && self.state.loginAttempts < self.state.attemptMax){
                            self.setState({ ctrlTxt: null });
                            setTimeout(function(){
                                self.state.loginAttempts = self.state.loginAttempts +1;
                                //console.log(" Attempt: ", self.state.loginAttempts, " Max: ", self.state.attemptMax);
                                self.authSnapshot();
                            }, 500); 
                        }
                        else {
                            self.setState({ ctrlTxt: "Unable To Match Face, Enter Information Manually" });
                        }
                        break;
                    case "userLogin":
                        if(res.data.error && !res.data.token) {
                            self.setState({ ctrlTxt: res.data.error });
                        }
                        else{
                            self.setState({ ctrlTxt: "Welcome" });
                            this.props.userHandler(res.data);
                        }
                        break;
                    default:
                        break;
                }
            }
            else {

            }
        }
        catch(ex){
            console.log(" Error with JAuth: ", ex);
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
            console.log(" [Login] Error getting video snapshot: ", ex);
        }

        return ret;
    }

   authSnapshot(){
       var self = this;
       try {
            var tmpSnapShot = self.getSnapShot();    
            self.setState({ type: "faceMatch" });                    
            // Send Snap to Jada
            self.state.loginSock.emit('jauth', {"type":self.state.type, "data":tmpSnapShot});
       }
       catch(ex){
            console.log("Error authenticating snapshot: ", ex);
       }
   }

   userLogin(){
       var self = this;
       try {                  
            var userData = {"userId":self.state.userId, "password":self.state.password};
            // Send User Info to Jada
            self.state.loginSock.emit('jauth', {"type":"userLogin", "data":userData});
       }
       catch(ex){
        console.log("Error with user login: ", ex);
       }
   }

   handleInputChange(event) {  this.setState({[event.target.name]: event.target.value}); }

   render(){     
      return(
         <div className="login-body">
            <h1>Connect to Jada Network</h1>

            <div className="login-ctrl">
                <div className="ctrl-live" onClick={() => this.toggleLiveVideo(false, true)}><div className="ctrl-btn"></div></div>    
            </div>   

            <div className="hex-view-container">
                <div className="hex login-view">
                    <div className="hexIn">
                        <div className="hexBody">
                            <div className="hex-body-container">
                                <div className={"ctrl-txt" + (this.state.ctrlTxt ? "" : " invisible")}>{this.state.ctrlTxt}</div>
                                <video id="video" className={(this.state.videoFilter !== null? "active": "inactive")}></video>      
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Login Forms */}                         
            <div className={"form-container uname" + (this.state.userId && this.state.type === "userLogin" ? " visible" : "")}>
                <div className="login-form-element">
                    <label>
                        <span>User Id</span>
                        <input type="text" name="userId" value={this.state.userId} onChange={this.handleInputChange}/>
                    </label>
                </div>
            </div>

            <div className={"form-container password" + (this.state.userId && this.state.type !== null ? " visible" : "")}>
                <div className="login-form-element">
                    <label>
                        <span>Password</span>
                        <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange}/>
                    </label>
                </div>
            </div>

            <div className={"form-container password" + (this.state.userId && this.state.type !== null ? " visible" : "")}>
                <div className="btn-container" onClick={this.userLogin}>
                        <div className="charater-icon">
                            <div className="icon-btn" ></div>                        
                        </div>
                    <div className="btn-title"><span>Login</span></div>
                </div>
            </div>

         </div>
      );
   }

   componentDidMount(){}
}

export default Login;