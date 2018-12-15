import React, { Component } from 'react';

/* Styles */
import "../css/app.less";

/* Components */
import Base from './templates/components/base';

class App extends Component{
   constructor(props) {
      super(props);
      this.state = {};
   }

   render(){     
      return(
         <div className="ps118-body">
            <div className="content-body">
               <Base />               
            </div>
         </div>
      );
   }

   componentDidMount(){}
}

export default App;