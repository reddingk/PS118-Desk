import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

var localSock;

class SocketCtrl extends Component{
    constructor(props) {
        super(props);
        this.state = {
            socketUrl: this.props.UrlBase,
            userId: this.props.userId,
            token: this.props.token
        }             
    }

    componentDidMount(){}    
    componentWillUnmount(){}

    initSocket(){ 
        try {
            var socketQuery = "userid="+ self.props.jUser.userId +"&token="+self.props.jUser.token;
            localSock = socketIOClient(self.props.jConnect.coreUrlBase, {query: socketQuery});
            this.props.sockConnects(localSock);
        }
        catch(ex){
            console.log("Error Init Socket: ",ex);
        }
    }

    render(){ 
        <div className="socket-ctrl">TST</div>
    }
}