import React, { Component } from 'react';

/* Components */

class JSearch extends Component{
    constructor(props) {
        super(props);
    }      

    render(){        
        return(
            <div className="jada-body-container">
                <div className={"jada-search-container " + this.props.character}>

                </div>
            </div>
        );        
    }
}

export default JSearch;