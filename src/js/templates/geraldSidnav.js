import React, { Component } from 'react';

class GeraldSideNav extends Component{
    constructor(props) {
        super(props);

        this.state = {
            characterList: []
        }

        this.getCharacterList = this.getCharacterList.bind(this);
        this.changeSelectedChar = this.changeSelectedChar.bind(this);
    }

    getCharacterList(){        
        var charList = (this.props.characterList ? this.props.characterList : {});
        this.setState({ characterList: Object.values(charList) });
    }

    changeSelectedChar(characterName) {
        console.log("Char Name: ", characterName);
        this.props.changeSelectedChar(characterName);
    }

    render(){        
        var listItems = this.state.characterList.map(function(item, i) {            
            return (
                <div key={item.name} className={ 'hex '+ (item.bodyComponent == null ? 'disable' : '') } onClick={() => this.changeSelectedChar(item.name)}>
                    <div className="hexIn">
                        <div className={ 'hexBody grid '+ item.name.toLowerCase()+'-grid'}>
                            <div className="hex-body-container">
                                <img className="grid-img" alt={ item.name.toLowerCase() + " nav-btn"} src={require('../../assets/imgs/' + item.images[0])}></img>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }, this);

        return(
            <div className="sidenav-container">
                <div className="header">Gerald Nav</div>
                <div className="nav-content">
                    <div className="hex-grid">
                        <div className="grid-container">
                            { listItems }
                        </div>
                    </div>
                </div>
            </div>
        );        
    }

    componentDidMount(){
        let self = this;
        self.getCharacterList();
    }
}

export default GeraldSideNav;