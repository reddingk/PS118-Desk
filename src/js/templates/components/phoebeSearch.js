import React, { Component } from 'react';

/* Components */

class PhoebeSearch extends Component{
    constructor(props) {
        super(props);

        this.state = {
            filterList:{}
        }  
        this.toggleSnapShot = this.toggleSnapShot.bind(this);      
    }      


    render(){        
        return(
            <div className="ctrl-container">
                <div className="icon-container">
                    {Object.keys(this.state.filterList).map((item, i) =>
                        <img className={"ctrl-item icon" + (this.props.videoFilter === item ? " active" : "")} src={this.state.filterList[item].icon} key={i} onClick={() => this.toggleSnapShot(item)} />
                    )}
                </div>
                <div className="text-container"></div>
            </div>
        );        
    }

    componentDidMount(){
        let self = this;    

        try {
            self.setState({filterList: this.props.filterList});    
        }  
        catch(ex){
            console.log(" [Phoebe] Error: ", ex);
        }
    }

    toggleSnapShot(item){
        this.props.toggleSnapShot(item);
    }
}

export default PhoebeSearch;