import React, { useContext, useEffect, useRef } from "react";
import classes from "./Room.module.css";
import axios from "axios";
import { Input, Icon, Button } from "semantic-ui-react";

import ChatMessage from "./ChatMessage/ChatMessage";
import { Context } from "../../context";
import Users from "./Users/Users";
import FormMessage from "./FormMessage/FormMessage";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";

const Room = ({ match, location }) => {
    const query = new URLSearchParams(location.search);
    const history = useHistory();
    const userName = query.get("userName");
    const roomId = match.params.id;
    const { users, messages, onLogin } = useContext(Context);
    const messagesRef = useRef(null);
    const inputShareRef = useRef(null);

    const checkUsers = useCallback(
        (roomId) => {
            axios.get(`/rooms/${roomId}`).then(({ data }) => {
                if (data.users.length === 0) {
                    // Если пользователей нет, редирект на /create-room
                    history.push("/create-room");
                    return;
                }
                onLogin({
                    roomId,
                    userName,
                });
            });
        },
        [history, onLogin, userName]
    );

    useEffect(() => {
        // Прокрутка сообщений
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, [messages]);

    useEffect(() => {
        //Проверка пользователей комнаты в базе данных
        checkUsers(roomId);
    }, [checkUsers, roomId]);

    //Копирование ссылки на комнату
    const handleCopy = useCallback(() => {
        inputShareRef.current.select();
        document.execCommand("copy");
    }, []);

    return (
        <div className={classes.Room}>
            <div className={classes.Header}>
                <h2 className={classes.Title}>ROOM : {roomId}</h2>
                <div className={classes.Links}>
                    <Input
                        readOnly
                        ref={inputShareRef}
                        className={classes.Link}
                        value={`${window.location.origin}?roomId=${roomId}`}
                    />
                    <Button onClick={handleCopy} animated="vertical">
                        <Button.Content hidden>Copy</Button.Content>
                        <Button.Content visible>
                            <Icon name="linkify" />
                        </Button.Content>
                    </Button>
                </div>
            </div>
            <div className={classes.Main}>
                <Users users={users} />
                <div className={classes.Chat}>
                    <div ref={messagesRef} className={classes.Messages}>
                        {messages.map((message, index) => (
                            <ChatMessage
                                key={message.text + index}
                                userName={message.userName}
                                text={message.text}
                                date={message.date.toLocaleString()}
                            />
                        ))}
                    </div>
                    <FormMessage />
                </div>
            </div>
        </div>
    );
};

export default Room;
