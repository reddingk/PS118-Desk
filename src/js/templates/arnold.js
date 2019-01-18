import React, { Component } from 'react';
const { ipcRenderer } = window.require("electron");

//var os = require('os');

class Arnold extends Component{
    constructor(props) {
        super(props);

        this.state = {
            testSz: [1,2,3,4,5],
            system: null,
            os:null,
            cpu:null,
            cpuCurrentspeed:null,
            users:null,
            temp:null,
            mem:null,
            battery:null,
            fsSize:null
        }

        this.getBatteryLvl = this.getBatteryLvl.bind(this);
    }
    

    render(){        
        return(
            <div className="body-container arnold-body">
                <div className="horizontal-view hex-grid">                    
                    <div className="grid-row"> 
                        {/* System Information*/}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <div className="hex-inner-container">                                        
                                            <div className={"txt-line blur_line" + (!this.state.system ? " blur" : "")}>
                                                <span>{(this.state.system ? this.state.system.manufacturer : "No Manufacturer Data")}</span>
                                                <span>{(this.state.system ? this.state.system.model : "N/A")}</span>
                                                <span>{(this.state.system ? this.state.system.version : "0.0.0")}</span>
                                            </div>

                                            <div className={"txt-line blur_line" + (!this.state.os ? " blur" : "")}>
                                                <span>{(this.state.os ? this.state.os.platform : "No Platform Data")}</span>
                                                <span>{(this.state.os ? "("+this.state.os.arch+")" : "N/A")}</span>
                                                <span>{(this.state.os ? this.state.os.release : "0.0.0.0")}</span>
                                            </div>                                                                                                                                                                                
                                            <div className="battery-icon">
                                                <div className="status" style={{width: this.getBatteryLvl(this.state.battery)}}></div>
                                                <span className="statusVal">{this.getBatteryLvl(this.state.battery)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        {/* CPU Info */}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <p>CPU Information</p>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        {/* Network Information*/}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <p>Network Information</p>
                                    </div>
                                </div>
                            </div>
                        </div>                                                      
                    </div> 
                    <div className="grid-row"> 
                            {/* Memory Information*/}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <p>Memory Information</p>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        {/* Disk Info */}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <p>Disk Information</p>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        {/* Tempurature Information*/}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <p>Tempurature Information</p>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </div>                       
                </div>
            </div>
        );        
    }

    componentDidMount(){
        let self = this;
        
        try{      
            self.initRender();             
            self.getAllDesktopData();
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }

    componentWillUnmount() {
        console.log("Removing ... ");
        ipcRenderer.removeListener('arnold-info-reply', this.initRender);
    }

    getAllDesktopData(){
        try{
            ipcRenderer.send('arnold-info-msg', 'all');
        }
        catch(ex){
            console.log(" Error getting desktop data: ", ex)
        }
    }

    initRender(){  
        var self = this;      
        try {
            ipcRenderer.on('arnold-info-reply', (event, arg) => { self.buildInfoObjects(arg) });
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }

    getBatteryLvl(battery){        
        var retLvl = 0;
        try {
            if(!battery){
                retLvl = 5;
            }
            else if(battery.percent >= 100){
                retLvl = 100;
            }
            else {
                retLvl = battery.percent;
            }
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }

        return retLvl + '%';
    }
    /* Build Data Object */
    buildInfoObjects(data){
        var self = this;
        var dataObjs = ["system", "os", "cpu", "net", "cpuCurrentspeed", "users", "temp", "mem", "battery", "fsSize"];
        try {
            if(!data.data){ console.log(" [Arnold] Error: No data"); }
            else {
                for(var i =0; i < dataObjs.length; i++){
                    if(dataObjs[i] in data.data){
                        this.setState({ [dataObjs[i]]: data.data[dataObjs[i]] });
                    }
                }
            }
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }
}

export default Arnold;