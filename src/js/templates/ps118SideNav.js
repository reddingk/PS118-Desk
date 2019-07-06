import React, { Component } from 'react';

class Ps118SideNav extends Component{
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
                <div key={i} className={ 'list-item '+ (item.bodyComponent == null ? 'disable' : '') } onClick={() => this.changeSelectedChar(item.name)}>
                    <div className={ 'item-grid '+ item.name.toLowerCase()+'-grid'}>
                        <div className="list-img-container">
                            <img className="list-img" alt={ item.name.toLowerCase() + " nav-btn"} src={require('../../assets/imgs/' + item.images[0])}></img>
                        </div>
                        <div className="list-name"><span>{item.name.toLowerCase()}</span></div>
                    </div>
                </div>
            );
        }, this);

        return(
            <div className="sidenav-container">
                <div className="header">Welcome</div>
                <div className="nav-content">
                    <div className="nav-list">
                        <div className="list-container">
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

export default Ps118SideNav;