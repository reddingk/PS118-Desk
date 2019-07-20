import React, { Component } from 'react';

/* Components */
import JSearch from './components/jSearch';

/* Images */

class Gerald extends Component{
    constructor(props) {
        super(props);
        this.state = {
            jBtns:[]
        }
        this.changeSearch = this.changeSearch.bind(this);
    }  

    render(){        
        return(
            <div className="body-container">
                <JSearch character={"gerald"} jbtns={this.state.jBtns} changeSearch={this.changeSearch} />
                <h1>Gerald</h1>
            </div>
        );        
    }

    changeSearch(searchType, searchStr){
        try {
            console.log(searchType,' Search: ', searchStr);
        }
        catch(ex){
            console.log("Error Performing Search: ",ex);
        }
    }
}

export default Gerald;