import React, { useState, useContext } from "react";
import classes from "./FormRoom.module.css";
import axios from "axios";
import { Button, Form, Header } from "semantic-ui-react";

import { Context } from "../../context";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";

const FormRoom = ({ title, roomId: initialRoomId = "", isJoin }) => {
    const history = useHistory();
    const [userName, setUserName] = useState("");
    const [roomId, setRoomId] = useState(initialRoomId);
    const { onLogin } = useContext(Context);

    const onEnter = (event) => {
        event.preventDefault();
        if (!roomId || !userName) {
            return;
        }

        const payload = {
            roomId,
            userName,
        };

        setUserName("");
        setRoomId("");

        axios.post("/rooms", payload).then(() => {
            onLogin(payload);
            history.push(`room/${roomId}?userName=${userName}`);
        });
    };

    const handleChangeRoomId = useCallback((event) => {
        setRoomId(event.target.value);
    }, []);

    const handleChangeUserName = useCallback((event) => {
        setUserName(event.target.value);
    }, []);

    return (
        <div className={classes.FormRoom}>
            <h1 className={classes.Title}>{title}</h1>
            <Form className={classes.Box} onSubmit={onEnter}>
                <Form.Input
                    value={roomId}
                    maxLength={15}
                    onChange={handleChangeRoomId}
                    readOnly={isJoin}
                    icon="registered"
                    iconPosition="left"
                    label={<Header size="medium">Room id</Header>}
                    placeholder="Room id"
                />
                <Form.Input
                    value={userName}
                    maxLength={15}
                    onChange={handleChangeUserName}
                    icon="user"
                    iconPosition="left"
                    label={<Header size="medium">Username</Header>}
                    placeholder="Username"
                />
                <Button
                    className={classes.Button}
                    content="ENTER"
                    primary
                    type="submit"
                />
            </Form>
        </div>
    );
};

export default FormRoom;
