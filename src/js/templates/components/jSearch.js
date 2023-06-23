import React, { Component } from 'react';

/* Images */
//import logoB from '../../../assets/imgs/logo/Logo1_b.png';
import logoW from '../../../assets/imgs/logo/Logo1_w.png';

import exit from '../../../assets/imgs/icons/external-link-alt-solid.svg';

/* Components */
import LoadSpinner from './loadSpinner';

class JSearch extends Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedsearch:"jada",
            searchstr:"",
            components: this.props.jbtns,
            subList:[],
            jScreenActive:false,
            jsearchLoading:true,
            jSearchResults:[],
        }

        this.handleTextChange = this.handleTextChange.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.changeSearch = this.changeSearch.bind(this);
        this.changeSubItem = this.changeSubItem.bind(this);
        this.togglejScreen = this.togglejScreen.bind(this);
        this.jadaSearch = this.jadaSearch.bind(this);
    }      

    render(){        
        return(
            <div className="jada-body-container">
                <div className={"jada-search-container " + this.props.character}>
                    <div className="jsearch-components">
                        <div className={"jsearch-btn"+(this.state.selectedsearch === "jada" ? " selected" :"")} onClick={()=> this.changeSearch({"title":"jada"})}><img src={logoW} alt="jada search icon"/></div>

                        <div className="jsearch-input">
                            <input type="text" name="searchstr" value={this.state.searchstr} onChange={(e) => this.handleTextChange(e)} onKeyDown={this.onKeyPress}/>
                            <span className="close-btn" onClick={this.clearSearch}></span>
                        </div>
                        {this.props.jbtns && this.props.jbtns.map((item,i) => 
                            <div className={"jsearch-btn"+(this.state.selectedsearch ===  item.title ? " selected" :"")+(item.toggle ? " toggle":"")} key={i} onClick={()=> this.changeSearch(item)}><img src={item.icon} alt="button icon"/></div>
                        )}
                    </div>
                </div>
                <div className={"jSubList-container " + this.props.character}>
                    {this.state.subList.map((item,i)=>
                        <div className="subPill" key={i} onClick={() => this.changeSubItem(item)}>{item.name}</div>
                    )}
                </div>
                {this.state.jScreenActive && 
                    <div className="jScreen">
                        {this.state.jsearchLoading && <div className="jscreenLoader"><LoadSpinner userClass={this.props.character} /></div>}
                        <div className="jscreen-close" onClick={() => this.togglejScreen(false)}><img src={exit} alt="jsceen close"/></div>
                        <div className="jscreen-container">
                            {this.state.jSearchResults.map((result,i) => 
                                <div class="searchResults-container">
                                    <div className="results-query">{result.search}</div>
                                    <div className="result-data"></div>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        );        
    }

    jadaSearch(str){
        var self = this;
        try{
            var ret = {"search":str,"results":{}};
            var defaultData = this.state.jSearchResults;
            //var pushLoc = defaultData.length;
            defaultData.push(ret);

            this.setState({jsearchLoading:true, jSearchResults: defaultData }, () =>{
                /* Perform Jada Search */

                self.setState({ jsearchLoading: false });
            });
        }
        catch(ex){
            console.log("Error performing jSearch: ",ex);
        }
    }

    clearSearch(){
        this.setState({searchstr:""});
    }

    changeSearch(item){
        var self = this;
        try {
            var toggleBtn = (this.state.selectedsearch === item.title);

            this.setState({selectedsearch: item.title, searchstr:"", subList:[]}, ()=> {
                if(item.title !== "jada"){
                    if(item.type && item.type === "primary"){
                        self.props.changeSearch(self.state.selectedsearch, self.state.searchstr, null);
                    }
                    else {
                        /* Show Data List */
                        self.setState({subList:item.dataList});
                    }

                    if(item.toggle && toggleBtn){
                        self.setState({selectedsearch:"jada",searchstr:"", subList:[]});
                    }
                }
            });
        }
        catch(ex){
            console.log("Error changing Search: ",ex);
        }
    }

    changeSubItem(item){
        try {
            this.props.changeSearch(this.state.selectedsearch, this.state.searchstr, item);
        }
        catch(ex){
            console.log("Error changing subItem: ",ex);
        }
    }

    onKeyPress(event){
        try {
            if(event.keyCode === 13){
                if(this.state.selectedsearch === "jada"){
                    this.togglejScreen(true);
                    this.jadaSearch(event.target.value);
                }
                else {
                    this.props.changeSearch(this.state.selectedsearch, event.target.value);
                }
            }
        }
        catch(ex){
            console.log("Error submitting info: ",ex);
        }
    }

    handleTextChange(event){
        try {
            var name = event.target.name;
            this.setState({ [name]:event.target.value });
        }
        catch(ex){
            console.log("Error with text change: ",ex);
        }
    }

    togglejScreen(status){
        try{
            this.setState({jScreenActive: status});
        }
        catch(ex){
            console.log("Error Toggling jScreen: ",ex);
        }
    }
}

export default JSearch;