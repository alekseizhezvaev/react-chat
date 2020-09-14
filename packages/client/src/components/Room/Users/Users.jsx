import React from "react";
import classes from "./Users.module.css";
import { Header, List, Image } from "semantic-ui-react";

const Users = ({ users }) => {
    return (
        <div className={classes.Users}>
            <Header as="h3" block>
                Online ({users.length})
            </Header>
            <List selection verticalAlign="middle">
                {users.map((user, index) => (
                    <List.Item key={user + index}>
                        <Image
                            avatar
                            src={`https://picsum.photos/${index}/200`}
                        />
                        <List.Content>
                            <List.Header className={classes.User}>
                                {user}
                            </List.Header>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </div>
    );
};

export default Users;
