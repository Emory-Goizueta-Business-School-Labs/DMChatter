import React, { Component} from "react";
const signalR = require('@aspnet/signalr');
import UserList from './UserList';
import Chat from './Chat';

class App extends Component{
    constructor(props) {
        super(props);

        this.connection;
        this.state = {
            me: '',
            isConnected: false,
            chats: []
        };

        this.onSendButtonClick = this.onSendButtonClick.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.onSendReceipt = this.onSendReceipt.bind(this);
        this.onInit = this.onInit.bind(this);
        this.onChatSelect = this.onChatSelect.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onUserConnected = this.onUserConnected.bind(this);
        this.onUserDisconnected = this.onUserDisconnected.bind(this);
    }

    componentDidMount() {
        this.connection = new signalR.HubConnectionBuilder().withUrl(this.props.hubUrl).build();
        this.connection.on("ReceiveMessage", this.onReceiveMessage);
        this.connection.on("Init", this.onInit);
        this.connection.on("SendReceipt", this.onSendReceipt);
        this.connection.on("UserConnected", this.onUserConnected);
        this.connection.on("UserDisconnected", this.onUserDisconnected);

        this.connection.start().then(() => {
            this.setState({
                isConnected: true
            });
        }).catch(err => {
            return console.error(err.toString());
        });
    }

    componentWillUnmount() {
        this.connection.off("ReceiveMessage");
        this.connection.off("Init");
        this.connection.off("SendReceipt");
        this.connection.off("UserConnected");
        this.connection.off("UserDisconnected");

        this.connect = null;
    }

    onUserConnected(user) {
        this.setState(state => {
            if (user === state.me) {
                return;
            }

            let chats = [...state.chats];
            chats.push({
                user,
                messages: [],
                isActive: state.chats.length === 0,
            });

            return {
                chats
            };
        });
    };

    onUserDisconnected(user) {
        this.setState(state => {
            if (user === state.me) {
                return;
            }

            let chats = [...state.chats];            

            chats = chats.filter(c => {
                return c.user !== user;
            });

            if (chats.length > 0 && chats.filter(c => c.isActive).length === 0) {
                chats[0].isActive = true;
            }

            return {
                chats
            };
        });
    }

    onInit(me, roster) {
        this.setState({
            me,
            chats: roster.filter(u => u !== me).map((u, i, a) => {
                return {
                    user: u,
                    messages: [],
                    isActive: i === 0,
                    hasUnreadMessages: false,
                };
            })
        });
    }


    onReceiveMessage(timestamp, user, message) {
        this.addMessageToChat(user, timestamp, message, false);
    }

    onSendReceipt(timestamp, user, message) {
        this.addMessageToChat(user, timestamp, message, true);
    }

    addMessageToChat(user, timestamp, message, isMine) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //var encodedMsg = userTo + " says " + msg;

        this.setState(state => {
            let chats = [...state.chats];

            for (let i = 0; i < chats.length; i++) {
                if (chats[i].user === user) {
                    chats[i].messages.push({
                        timestamp,
                        message,
                        mine: isMine,
                    });

                    if (!chats[i].isActive) {
                        chats[i].hasUnreadMessages = true;
                    }

                    break;
                }
            }

            return {
                chats
            };
        });
    }

    sendMessage(targetUser, message) {
        this.connection.invoke("SendMessage", targetUser, message).catch(err => {
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

    selectChat(user) {
        this.setState(state => {
            let chats = [...state.chats];

            chats.forEach(c => {
                if (c.user === user) {
                    c.isActive = true;
                    c.hasUnreadMessages = false;
                    return;
                }

                c.isActive = false;
            });

            return {
                chats
            };
        });
    }

    onChatSelect(e) {
        this.selectChat(e.target.value);
    }

    render(){
        if (this.state.chats.length === 0) {
            return (<div>Waiting for someone else to connect…</div>);
        }

        return(
            <div className="chatApp">
                <UserList chats={this.state.chats} onSelect={this.onChatSelect} />
                <div className="chatApp-chats">
                    {this.state.chats.map(c => {
                        return (<Chat className="chatApp-chat" key={c.user} {...c} sendMessage={ this.sendMessage }/>)
                    })}
                </div>
            </div>
        );
    }
}

export default App;
