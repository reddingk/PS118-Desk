import React, { Component } from 'react';

class Helga extends Component{
    constructor(props) {
        super(props);

        this.state = {}
    }

    render(){        
        return(
            <div className="body-container helga-body">
                <h1>Helga</h1>
            </div>
        );        
    }

    componentDidMount(){
        //let self = this;        
    }
}

export default Helga;