import React, { Component} from "react";
const signalR = require('@aspnet/signalr');

class App extends Component{
    constructor(props) {
        super(props);

        this.connection;
        this.state = {
            isConnected: false,
            message: '',
            messages: []
        }

        this.onSendButtonClick = this.onSendButtonClick.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
    }

    componentDidMount() {
        this.connection = new signalR.HubConnectionBuilder().withUrl(this.props.hubUrl).build();
        this.connection.on("ReceiveMessage", this.onReceiveMessage);

        this.connection.start().then(() => {
            this.setState({
                isConnected: true
            });
        }).catch(err => {
            return console.error(err.toString());
        });
    }

    onReceiveMessage(user, message) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var encodedMsg = user + " says " + msg;
        this.setState({
            messages: [...this.state.messages, encodedMsg]
        });
    }

    sendMessage(message) {
        this.connection.invoke("SendMessage", message).catch(err => {
            return console.error(err.toString());
        });
    }

    onMessageChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    onSendButtonClick(e) {
        this.sendMessage(this.state.message);
        e.preventDefault();
    }

    render(){
        return(
            <div>
                <div className="container">
                    <div className="row">&nbsp;</div>
                    <div className="row">
                        <div className="col-2">Message</div>
                        <div className="col-4"><input type="text" id="messageInput" value={this.state.message} onChange={this.onMessageChange} /></div>
                    </div>
                    <div className="row">&nbsp;</div>
                    <div className="row">
                        <div className="col-6">
                            <input disabled={!this.state.isConnected} type="button" id="sendButton" value="Send Message" onClick={this.onSendButtonClick} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <ul id="messagesList">
                            { this.state.messages.map(m => {
                                return (<li>{m}</li>);
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
