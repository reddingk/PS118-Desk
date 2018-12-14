import React, { Component } from 'react';

class SideNavBtn extends Component{
    constructor(props) {
        super(props);

        this.state = {
            character: null
        }
        
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }   

    onSetSidebarOpen(status) {
        this.props.onSetSidebarOpen(status);
    }

    render(){ 

        return(
            <div className="nav-btn-container">
                {this.state.character != null &&
                    <div className="btn-container" onClick={() => this.onSetSidebarOpen(true)}>
                        <div className={'charater-icon '+ this.state.character.name.toLowerCase() }>
                            <img className="icon-img" alt={this.state.character.name.toLowerCase() + "-btn"} src={require('../../../assets/imgs/' + this.state.character.images[1])}></img>                        
                        </div>
                        <div className={'btn-title ' + this.state.character.name.toLowerCase()}><span>{ this.state.character.name }</span></div>
                    </div>
                }
            </div>
        );        
    }

    componentWillReceiveProps(nextProps) {
        var tmpCharacter = (nextProps.characterList && nextProps.selectedChar ? nextProps.characterList[nextProps.selectedChar.toLowerCase()] : null);
        this.setState({ character: tmpCharacter });  
    }

}

export default SideNavBtn;