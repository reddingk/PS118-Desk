import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const { ipcRenderer } = window.require("electron");


am4core.useTheme(am4themes_animated);

class Arnold extends Component{
    constructor(props) {
        super(props);

        this.state = {
            system: null,
            os:null,
            cpu:null,
            cpuCurrentspeed:null,
            users:null,
            temp:null,
            mem:null,
            battery:null,
            fsSize:null,
            net:null,
            networkConnections: null
        }
        this.cpuChart = null;
        
        this.getBatteryLvl = this.getBatteryLvl.bind(this);
        this.getProgressLvl = this.getProgressLvl.bind(this);
        this.initRender = this.initRender.bind(this);
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
                                            </div>

                                            <div className={"txt-line blur_line" + (!this.state.os ? " blur" : "")}>
                                                <span>{(this.state.os ? this.state.os.platform : "No Platform Data")}</span>
                                                <span>{(this.state.os ? "("+this.state.os.arch+")" : "N/A")}</span>
                                                <span>{(this.state.os ? this.state.os.release : "0.0.0.0")}</span>
                                            </div>    

                                            <div className={"txt-line blur_line" + (!this.state.cpu ? " blur" : "")}>
                                                <span>{(this.state.cpu ? this.state.cpu.manufacturer : "No Manufacturer Data")}</span>
                                                <span>{(this.state.cpu ? this.state.cpu.brand : "No Brand Data")}</span>
                                            </div>

                                            <div className={"txt-line blur_line" + (!this.state.cpu ? " blur" : "")}>
                                                <span>Cores: {(this.state.cpu ? this.state.cpu.cores : "0")}</span>
                                                <span>Processors: {(this.state.cpu ? this.state.cpu.processors : "0")}</span>
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
                        {/* Gauge Bundle */}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <div className="hex-inner-container full"> 
                                            <div className="arnoldGauge" id="cpuChart"></div>
                                            <div className="arnoldLegend" id="cpuLegend"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                                 
                    </div> 
                    <div className="grid-row"> 
                        {/* Network Information*/}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <div className="hex-inner-container">                                                                                
                                            <div className="dropTbl">
                                                {(!this.state.net ?
                                                    <div>Loading ....</div> :
                                                    this.state.net.filter(function(fItem){return !fItem.internal;}).map((item, i) =>
                                                        <div className="dropRow" key={i}>
                                                            <div className="dropTitle">{item.iface}</div>
                                                            <div className="dropIp">{item.ip4}</div>
                                                            <div className="dropIp">{item.mac}</div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>   
                        {/* Disk Info */}                         
                        <div className="hex">
                            <div className="hexIn">
                                <div className="hexBody">
                                    <div className="hex-body-container">
                                        <div className="hex-inner-container">
                                            <div className="progressTbl">
                                                {(!this.state.fsSize ?
                                                    <div>Loading ....</div> :
                                                    this.state.fsSize.map((item, i) =>
                                                        <div className="progressRow" key={i}>
                                                            <div className="progressTitle">{item.fs}</div>
                                                            <div className="progressContainer">
                                                                <div className="lvlContainer" style={{width: this.getProgressLvl(item, 'percent')}}></div>
                                                                <div className="lvlVal">{this.getProgressLvl(item, '')} GB</div>
                                                            </div>
                                                        </div>
                                                    )                                                    
                                                )} 
                                            </div>
                                        </div>
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
            ipcRenderer.on('arnold-info-reply', self.initRender);           
            self.getAllDesktopData();
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }

    componentWillUnmount() {
        console.log("Removing ... ");
        ipcRenderer.removeListener('arnold-info-reply', this.initRender);
        if (this.cpuChart) { this.cpuChart.dispose();  }
    }

    getAllDesktopData(){
        try{
            ipcRenderer.send('arnold-info-msg', 'all');
        }
        catch(ex){
            console.log(" Error getting desktop data: ", ex)
        }
    }

    initRender(event, arg){  
        var self = this;      
        try {
            self.buildInfoObjects(arg)
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }

    /* Get Battery Level */
    getBatteryLvl(battery){        
        var retLvl = 0;
        try {
            if(!battery){
                retLvl = 0;
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

    getProgressLvl(data, type){
        var ret = 0;
        try {

            if(!data){
                ret = 0;
            }
            else if(type == "percent"){
                ret = (data.used / data.size)*100;
            }
            else {
                ret = parseFloat((data.used / Math.pow(1024, 3)).toFixed(2));
            }

            ret = (type == "percent" ? ret + '%' : ret);
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
        
        return ret;
    }

    /* Build Computer Gauges */
    buildCompGauges(){
        var self = this;

        try {
            var chart = am4core.create("cpuChart", am4charts.GaugeChart);

            chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

            chart.startAngle = 0;
            chart.endAngle = 360;

            chart.legend = new am4charts.Legend();

            var legendContainer = am4core.create("cpuLegend", am4core.Container);
            legendContainer.width = am4core.percent(40);
            legendContainer.height = am4core.percent(100);
            chart.legend.parent = legendContainer;
            
            chart.legend.parent = legendContainer;
            chart.legend.data = [];
            chart.legend.fontSize = 10;

            var markerTemplate = chart.legend.markers.template;
            markerTemplate.width = 10;
            markerTemplate.height = 10;

            // cpu
            if(self.state.cpu){
                var axis1 = self.createAxis(chart, 0, parseFloat(self.state.cpu.speedmax), -85, -5, "#1349D0");
                var hand1 = self.createHand(chart, axis1, parseFloat(self.state.cpu.speed));
                chart.legend.data.push({"name":"CPU Speed", "fill":hand1.fill});
            }
            // mem
            if(self.state.mem){
                var memMax = parseFloat((self.state.mem.total / Math.pow(1024, 3)).toFixed(2));
                var memTotal = parseFloat((self.state.mem.active / Math.pow(1024, 3)).toFixed(2));
                var axis2 = self.createAxis(chart, 0, memMax, 5, 85, "#3465DF");
                var hand2 = self.createHand(chart, axis2, memTotal);
                chart.legend.data.push({"name":"Memory", "fill":hand2.fill});
            }
            // temp
            if(self.state.temp && self.state.temp.max >= 0){
                var axis3 = self.createAxis(chart, 0, self.state.temp.max, 95, 175, "#7B9CF0");
                var hand3 = self.createHand(chart, axis3, self.state.temp.main);
                chart.legend.data.push({"name":"Temp", "fill":hand3.fill});
            }
            // networkconnections
            if(self.state.networkConnections){
                var establishedList = self.state.networkConnections.filter(function(item){
                    return item.state == "ESTABLISHED";
                });

                var axis4 = self.createAxis(chart, 0, self.state.networkConnections.length, 185, 265, "#AAC0F7");
                var hand4 = self.createHand(chart, axis4, establishedList.length);
                chart.legend.data.push({"name":"EST Connections", "fill":hand4.fill});
            }

            self.cpuChart = chart;
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }
    /* create Chart Axis */
    createAxis(chart, min, max, start, end, color) {
        var axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = min;
        axis.max = max;
        axis.strictMinMax = true;
        axis.tooltip.disabled = false;
        axis.renderer.useChartAngles = false;
        axis.renderer.startAngle = start;
        axis.renderer.endAngle = end;
        axis.renderer.minGridDistance = 100;
      
        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.strokeWidth = 10;
        axis.renderer.line.stroke = am4core.color(color);
        axis.renderer.ticks.template.stroke = am4core.color(color);
      
        axis.renderer.ticks.template.strokeOpacity = 1;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.ticks.template.length = 10;
        
        return axis;
    }

    /* Create Gauge Hand */
    createHand(chart, axis, value) {
        var hand = chart.hands.push(new am4charts.ClockHand());
        hand.fill = axis.renderer.line.stroke;
        hand.stroke = axis.renderer.line.stroke;
        hand.axis = axis;
        hand.pin.disabled = true;
        hand.startWidth = 10;
        hand.endWidth = 0;
        hand.radius = am4core.percent(90);
        hand.innerRadius = am4core.percent(70);
        hand.value = value;
        return hand;
      }
    /* Build Data Object */
    buildInfoObjects(data){
        var self = this;
        var dataObjs = ["system", "os", "cpu", "net", "cpuCurrentspeed", "users", "temp", "mem", "battery", "fsSize", "networkConnections"];
        try {
            if(!data.data){ console.log(" [Arnold] Error: No data"); }
            else {
                console.log(data.data);
                for(var i =0; i < dataObjs.length; i++){
                    if(dataObjs[i] in data.data){
                        this.setState({ [dataObjs[i]]: data.data[dataObjs[i]] });
                    }
                }

                self.buildCompGauges();
            }
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }
}

export default Arnold;