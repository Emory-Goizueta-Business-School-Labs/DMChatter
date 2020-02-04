import React, { Component} from "react";

class Chat extends Component{
    constructor(props) {
        super(props);

        this.messageRef = React.createRef();
        this.state = {
            message: '',
        };

        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onComponentMount() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messageRef.scrollTop = this.messageRef.scrollHeight - this.messageRef.clientHeight;
    }

    handleSubmit(e) {
        if (!!this.props.sendMessage) {
            this.props.sendMessage(this.props.user, this.state.message);

            this.setState({
                message: '',
            });
        }
        
        e.preventDefault();
    }

    handleMessageChange(e) {
        this.setState({
            message: e.target.value,
        });
    }

    render(){
        let classes = "chatApp-chat" + (this.props.isActive ? " isActive": "");
        return(
            <div className={classes}>
                <ol className="chat-messages" ref={this.messageRef}>
                    { this.props.messages.sort((a,b) => a.timestamp > b.timestamp).map(m => {
                        return (<li key={m.timestamp} className={"chat-message" + (m.mine ? " isMine" : "")}>{m.message}</li>);
                    })}
                </ol>
                <form className="chat-composer" onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.message} onChange={this.handleMessageChange} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        );
    }
}

export default Chat;
