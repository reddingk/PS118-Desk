import React, { Component } from 'react';
import Sidebar from "react-sidebar";

/* Models */
import characterModel from '../../datamodels/characters.model';

/* Styles */
import "../../css/app.less";

/* Components */
import SideNavBtn from './components/sideNavBtn';
import Ps118SideNav from './ps118SideNav';
import Gerald from './gerald';
//import FuzzySlippers from './fuzzySlippers';
import Phoebe from './phoebe';
import Arnold from './arnold';
import Helga from './helga';

/* JNetwork Info */
class Base extends Component{
   constructor(props) {
      super(props);
      this.state = {
        sidebarOpen: false,
        selectedChar: null,
        selectedItem: null,
        dataLibrary:{}
      };


      this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
      this.changeSelectedChar = this.changeSelectedChar.bind(this);
      this.renderSwitch = this.renderSwitch.bind(this);

      this.characterList = {
         "gerald": new characterModel("Gerald", null, <Gerald />, "Gerald home screen"),
         "fuzzyslippers": new characterModel("FuzzySlippers", null, null, "FuzzySlippers bot system"),
         "arnold": new characterModel("Arnold", null, <Arnold />, "Arnold client system info"),
         "helga" : new characterModel("Helga", null, <Helga jConnect={this.props.jConnect} jUser={this.props.jUser}/>, "Helga maps system"),
         "phoebe": new characterModel("Phoebe", null, <Phoebe jConnect={this.props.jConnect} jUser={this.props.jUser}/>, "Phoebe image processing"),
         "sid"   : new characterModel("Sid", null, null, "Sid events and information")
      };
   }

   onSetSidebarOpen(open) {
      this.setState({ sidebarOpen: open });
   }

   changeSelectedChar(newChar){
     this.setState({ selectedChar: newChar, selectedItem: this.characterList[newChar], sidebarOpen: false});
   }

   renderSwitch(param) {
      let tmpChar = (param != null ? this.characterList[param.toLowerCase()].bodyComponent : null);
      return ( !tmpChar ? this.characterList["gerald"].bodyComponent : tmpChar);
   }

   joinNetwork(){
      var self = this;
      try {
          let connectSrc = new EventSource(self.props.jConnect.urlBase +'/connect/'+self.props.jUser.userId);

          connectSrc.onmessage = function(e){
              var jdata = JSON.parse(e.data);

              if(jdata.command){
                  self.commander(jdata.command, jdata.data);
              }
          }
      }
      catch(ex){
          console.log("Error With JNetwork Connection: ", ex);
      }
   }

   render(){     
      return(
        <div>
            <Sidebar sidebar={<Ps118SideNav characterList={this.characterList} selectedChar={this.state.selectedChar} changeSelectedChar={this.changeSelectedChar} />}  open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} shadow={false} styles={{ sidebar: { background: "linear-gradient(to right, rgba(58, 62, 72,0.9), rgba(0,0,0,0) 75%)", minWidth:'70%', zIndex: 1000 }, content:{ display: "flex"} }}>
                <div className="main-body">                     
                    <SideNavBtn characterList={this.characterList} selectedChar={this.state.selectedChar} onSetSidebarOpen={this.onSetSidebarOpen}/>                                      
                    { this.renderSwitch(this.state.selectedChar)}
                </div>
            </Sidebar>
        </div>         
      );
   }

   componentDidMount(){
      this.changeSelectedChar("gerald");
      /* [REMOVE] */
      //this.joinNetwork();
   }

  /* jNetwork Functions */
  commander(cmd,data){
      switch(cmd){
         case 'connectionList':
            this.updateConnectionList(data);
            break;
         default:
            break;
      }
   }

   // Update Connection List
   updateConnectionList(newList){
      var self = this;
      try {
         console.log("Debug: Updated Connection List");
         for(var i=0; i < newList.length; i++){
            if(self.conList && !(newList[i].connectionId in self.conList)){
                  self.props.jConnect.conList[newList[i].connectionId] = newList[i];
            }
         }
      }
      catch(ex){
         console.log("Error Updating connection list: ", ex);
      }
   }
}

export default Base;