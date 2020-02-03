import React, { Component} from "react";

class UserList extends Component{
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }
    
    onChange(e) {
        this.props.onSelect(e);
    }

    render(){
        return(
            <select className="chatApp-userList"  size={this.props.users.length} onChange={this.onChange} value={this.props.selectedUser}>
                { this.props.users.map(u => {
                    return(<option key={u} value={u}>{u}</option>);
                })}
            </select>
        );
    }
}

export default UserList;
