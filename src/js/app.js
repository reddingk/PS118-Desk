import React, { Component } from 'react';
import { setDefaultOptions } from 'esri-loader';

/* Styles */
import "../css/app.less";

/* Components */
import CircuitBack from './templates/components/circuitBack';
import Base from './templates/base';
import Login from './templates/login';

class App extends Component{
   constructor(props) {
      super(props);
      this.state = {
         //jUser: {}
         /* [REMOVE] */
         jUser: {_id: "5ba02d36ea65672f28f6eec2", userId: "ktest", name: "Test Man", token: "J6968MjfCFaeMHMt8kDAA1"}
      };

      this.jConnect = {
         coreUrlBase: 'http://localhost:1003',
         urlBase: 'http://localhost:1003/jNetwork',
         conList: {},
         localSock: null
      };

      this.userHandler = this.userHandler.bind(this);
   }

   userHandler(newUser) {
      var self = this;
      try {
         if(newUser){
            self.setState({jUser: newUser});
         }
      }
      catch(ex){
         console.log("Error with user Handler: ", ex);
      }
   }

   render(){     
      return(
         <div className="ps118-body">
            <CircuitBack />
            <div className="content-body">
               { (!this.state.jUser || !this.state.jUser.token ? 
                  <Login jConnect={this.jConnect} jUser={this.state.jUser} userHandler={this.userHandler}/> : 
                  <Base jConnect={this.jConnect} jUser={this.state.jUser} userHandler={this.userHandler}/>)
               }  
            </div>
         </div>
      );
   }

   componentDidMount(){
      /* esri version */
      setDefaultOptions({ version: '4.7' })
   }
}

export default App;