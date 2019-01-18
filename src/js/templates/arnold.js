import React, { Component } from 'react';

class Arnold extends Component{
    constructor(props) {
        super(props);

        this.state = {
            testSz: [1,2,3,4,5]
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
        //let self = this;        
    }
}

export default Arnold;