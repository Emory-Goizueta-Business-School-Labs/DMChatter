import React, { Component} from "react";

class UserList extends Component{
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onChange(e) {
        this.props.onSelect(e);
    }

    onClick(e) {
        this.props.onSelect(e);
    }

    render(){
        return(
            <div className="chatApp-userList">
                { this.props.chats.map(c => {
                    let classes = '';
                    if (c.isActive) {
                        classes += ' isActive';
                    }

                    if (c.hasUnreadMessages) {
                        classes += ' hasUnreadMessages';
                    }
                    return(<button className={classes} key={c.user} value={c.user} onClick={this.onClick}>{c.user}</button>);
                })}
            </div>
        );
    }
}

export default UserList;
