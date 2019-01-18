import React, { Component } from 'react';
var si = require('systeminformation');
var os = require('os');

class Arnold extends Component{
    constructor(props) {
        super(props);

        this.state = {
            testSz: [1,2,3,4,5],
            systeminfo: null,
            os:null,
            battery:null
        }        
    }
    

    render(){        
        return(
            <div className="body-container arnold-body">
                <div className="horizontal-view hex-grid">
                    {/* <div className="horizontal-container hex-grid">*/}
                        <div className="grid-row"> 
                            {this.state.testSz.map((item, i) =>                                             
                                    <div className="hex" key={i}>
                                        <div className="hexIn">
                                            <div className="hexBody">
                                                <div className="hex-body-container">
                                                    <p>T{i}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                            )}
                        </div> 
                        <div className="grid-row"> 
                            {this.state.testSz.map((item, i) =>                                             
                                    <div className="hex" key={i}>
                                        <div className="hexIn">
                                            <div className="hexBody">
                                                <div className="hex-body-container">
                                                    <p>T{i}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                            )}
                        </div>   
                    {/*</div>*/}
                </div>
            </div>
        );        
    }

    componentDidMount(){
        let self = this;
        
        try{
            console.log("1] ");
            self.getAllDesktopData();
        }
        catch(ex){
            console.log(" [Arnold] Error: ", ex);
        }
    }

    getAllDesktopData(){
        try{
            console.log("2] ");
            si.getAllData().then((data) =>  {
                console.log('All-Information:');
                console.log(data);
            }).catch(error => console.error(error));
            console.log("3] ", os.platform(), " | ", os.release());
        }
        catch(ex){
            console.log(" Error getting desktop data: ", ex)
        }
    }
}

export default Arnold;