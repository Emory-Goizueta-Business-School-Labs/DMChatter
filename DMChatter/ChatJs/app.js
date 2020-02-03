import React, { Component} from "react";
const signalR = require('@aspnet/signalr');
import UserList from './UserList';
import Chat from './Chat';

class App extends Component{
    constructor(props) {
        super(props);

        this.connection;
        this.state = {
            isConnected: false,
            message: '',
            chats: [{
                user: "Gandalf",
                messages: [
                    {
                        timestamp: 1,
                        message: "You're late.",
                        mine: true,
                    },
                    {
                        timestamp: 2,
                        message: "A wizard is never late, Frodo Baggins. Nor is he early. He arrives precisely when he means to.",
                        mine: false,
                    }
                ],
                isActive: true,
            },
            {
                user: "Sam",
                messages: [
                    {
                        timestamp: 1,
                        message: "Go back, Sam. I'm going to Mordor alone.",
                        mine: true,
                    },
                    {
                        timestamp: 2,
                        message: "Of course you are. And I'm coming with you.",
                        mine: false,
                    }
                ],
            },
            {
                user: "Strider",
                messages: [
                    {
                        timestamp: 1,
                        message: "You draw far too much attention to yourself, Mr. \"Underhill.\"",
                        mine: false,
                    },
                    {
                        timestamp: 2,
                        message: "What do you want?",
                        mine: true,
                    },
                    {
                        
                        timestamp: 3,
                        message: "More caution from you. That is no mere trinket you carry.",
                        mine: false,
                    },
                    {
                        
                        timestamp: 4,
                        message: "I carry nothing.",
                        mine: true,
                    },
                    {
                        
                        timestamp: 5,
                        message: "Indeed. I can avoid being seen if I wish, but to disappear entirely; that is a rare gift.",
                        mine: false,
                    },
                    {
                        
                        timestamp: 6,
                        message: "Who are you?",
                        mine: true,
                    },
                    {
                        
                        timestamp: 7,
                        message: "Are you frightened?",
                        mine: false,
                    },
                    {
                        
                        timestamp: 8,
                        message: "Yes.",
                        mine: true,
                    },
                    {
                        
                        timestamp: 9,
                        message: "Not nearly frightened enough. I know what hunts you.",
                        mine: false,
                    },
                ],
            }]
        };

        this.onSendButtonClick = this.onSendButtonClick.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
        this.onReceiveMessage = this.onReceiveMessage.bind(this);
        this.onReceiveRoster = this.onReceiveRoster.bind(this);
        this.onChatSelect = this.onChatSelect.bind(this);
    }

    componentDidMount() {
        return;
        this.connection = new signalR.HubConnectionBuilder().withUrl(this.props.hubUrl).build();
        this.connection.on("ReceiveMessage", this.onReceiveMessage);
        this.connection.on("ReceiveRoster", this.onReceiveRoster);

        this.connection.start().then(() => {
            this.setState({
                isConnected: true
            });
        }).catch(err => {
            return console.error(err.toString());
        });
    }

    onReceiveRoster(roster) {
        this.setState({
            users: roster
        });
    }


    onReceiveMessage(timestamp, user, message) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //var encodedMsg = userTo + " says " + msg;

        this.setState(state => {
            let chatMessages = [...state.messages[user]];

            messages: [...(this.state.messages[user]), {
                sender: user,
                message: msg
            }]
        });
    }

    onMessageReceipt(timestamp, user, message) {
        this.addMessageToChat(user, "self")
    }

    addMessageToChat(chat, from, message) {
        var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        //var encodedMsg = userTo + " says " + msg;

        this.setState({
            messages: [...(this.state.messages[chat]), {
                sender: from,
                message: msg
            }]
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

    selectChat(user) {
        this.setState(state => {
            let chats = [...state.chats];

            chats.forEach(c => {
                if (c.user === user) {
                    c.isActive = true;
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
        return(
            <div className="chatApp">
                <UserList users={this.state.chats.map(c => c.user)} onSelect={this.onChatSelect} selectedUser={this.state.chats.filter(c => c.isActive)[0].user} />
                <div className="chatApp-chats">
                    {this.state.chats.map(c => {
                        return (<Chat className="chatApp-chat" key={c.user} {...c} />)
                    })}
                </div>
            </div>
        );
    }
}

export default App;
