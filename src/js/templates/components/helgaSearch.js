import React, { Component } from 'react';

/* Components */

class HelgaSearch extends Component{
    constructor(props) {
        super(props);

        this.state = {
            mapSearch:''
        }        
        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
    }      

    render(){        
        return(
            <div className="searchContainer">
                <div className="jadaIcon">J</div>              
                <div className="helgatextbox">
                    <input type="text" name="mapSearch" value={this.state.mapSearch} onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} placeholder="Ask Jada Maps"/>
                </div>
            </div>
        );        
    }

    _handleInputChange(event) {  this.setState({[event.target.name]: event.target.value}); }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {            
            this.props.searchQuery(this.state.mapSearch);
        }
    }
}

export default HelgaSearch;