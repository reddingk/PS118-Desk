import React, { Component } from 'react';

/* Components */
import JSearch from './components/jSearch';

class Gerald extends Component{
    constructor(props) {
        super(props);

        this.state = {}
    }  

    render(){        
        return(
            <div className="body-container">
                <JSearch character={"gerald"}/>
                <h1>Gerald</h1>
            </div>
        );        
    }
}

export default Gerald;