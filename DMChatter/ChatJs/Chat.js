import React, { Component} from "react";

class Chat extends Component{
    constructor(props) {
        super(props);

        this.messageRef = React.createRef();
    }

    onComponentMount() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messageRef.scrollTop = this.messageRef.scrollHeight - this.messageRef.clientHeight;
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
                <form className="chat-composer">
                    <input type="text" />
                    <input type="submit" value="Send" />
                </form>
            </div>
        );
    }
}

export default Chat;
