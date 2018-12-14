import React, { Component } from 'react';
import Sidebar from "react-sidebar";

/* Models */
import characterModel from '../datamodels/characters.model';

/* Styles */
import "../css/app.less";

/* Components */
import SideNavBtn from './templates/components/sideNavBtn';
import GeraldSideNav from './templates/geraldSidnav';
import Gerald from './templates/gerald';
import FuzzySlippers from './templates/fuzzySlippers';
import Phoebe from './templates/phoebe';

/* JNetwork Info */

class App extends Component{
   constructor(props) {
      super(props);
      this.state = {
        sidebarOpen: false,
        selectedChar: null,
        selectedItem: null,
        dataLibrary:{}
      };

      this.jConnect = {
         currUser: "T3stUser2",
         coreUrlBase: 'http://localhost:1003',
         urlBase: 'http://localhost:1003/jNetwork',
         conList: {},
         localSock: null
      };

      this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
      this.changeSelectedChar = this.changeSelectedChar.bind(this);
      this.renderSwitch = this.renderSwitch.bind(this);

      this.characterList = {
         "gerald": new characterModel("Gerald", null, <Gerald />, "Gerald home screen"),
         "fuzzyslippers": new characterModel("FuzzySlippers", null, <FuzzySlippers />, "FuzzySlippers bot system"),
         "arnold": new characterModel("Arnold", null, null, "Arnold client system info"),
         "helga" : new characterModel("Helga", null, null, "Helga maps system"),
         "phoebe": new characterModel("Phoebe", null, <Phoebe jConnect={this.jConnect}/>, "Phoebe image processing"),
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
          let connectSrc = new EventSource(self.jConnect.urlBase +'/connect/'+self.jConnect.currUser);

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
         <div className="ps118-body">
            <div className="content-body">
               <Sidebar sidebar={<GeraldSideNav characterList={this.characterList} selectedChar={this.state.selectedChar} changeSelectedChar={this.changeSelectedChar} />}  open={this.state.sidebarOpen} onSetOpen={this.onSetSidebarOpen} styles={{ sidebar: { background: "rgba(50,50,50,0.95)" } }}>
                  <div className="main-body">                     
                     <SideNavBtn characterList={this.characterList} selectedChar={this.state.selectedChar} onSetSidebarOpen={this.onSetSidebarOpen}/>                                      
                     { this.renderSwitch(this.state.selectedChar)}
                  </div>
               </Sidebar>
            </div>
         </div>
      );
   }

   componentDidMount(){
      this.changeSelectedChar("gerald");
      this.joinNetwork();
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
                  self.jConnect.conList[newList[i].connectionId] = newList[i];
            }
         }
      }
      catch(ex){
         console.log("Error Updating connection list: ", ex);
      }
   }
}

export default App;