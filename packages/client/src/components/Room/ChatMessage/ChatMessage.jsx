import React from "react";
import classes from "./ChatMessage.module.css";
import { Message } from "semantic-ui-react";

const ChatMessage = ({ userName, text, date }) => {
    return (
        <div className={classes.ChatMessage}>
            <Message color="blue" compact>
                <Message.Content>
                    <Message.Header> {userName} </Message.Header>
                    <p className={classes.MessageContent}>{text}</p>
                    <small className={classes.MessageDate}>{date}</small>
                </Message.Content>
            </Message>
        </div>
    );
};

export default ChatMessage;
