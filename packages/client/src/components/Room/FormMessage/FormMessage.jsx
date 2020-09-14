import React, { useState, useContext, useEffect, useRef } from "react";
import classes from "./FormMessage.module.css";
import { Form, TextArea, Button } from "semantic-ui-react";
import { Context } from "../../../context";
import { useCallback } from "react";

const FormMessage = () => {
    const [message, setMessage] = useState("");
    const { onAddMessage } = useContext(Context);

    //Функция для отправки сообщения
    const onSendMessage = useCallback(
        (mess) => {
            if (!mess.trim()) {
                return;
            }

            onAddMessage(mess);

            setMessage("");
            mesRef.current = "";
        },
        [onAddMessage]
    );

    //Служебная переменная для реализации отправки сообщения через ctrl+enter
    const mesRef = useRef("");
    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            onSendMessage(message);
        },
        [message, onSendMessage]
    );

    const handleChangeMessage = useCallback((event) => {
        setMessage(event.target.value);
        mesRef.current = event.target.value;
    }, []);

    useEffect(() => {
        const keydownHandler = (event) => {
            if (event.keyCode === 13 && event.ctrlKey) {
                onSendMessage(mesRef.current);
            }
        };

        document.addEventListener("keydown", keydownHandler);

        return () => {
            document.removeEventListener("keydown", keydownHandler);
        };
    }, [onSendMessage]);

    return (
        <Form className={classes.FormMessage} onSubmit={handleSubmit}>
            <TextArea
                value={message}
                onChange={handleChangeMessage}
                className={classes.FormTextArea}
                placeholder="Write a message..."
            />
            <Button type="submit" color="blue">
                Send message
            </Button>
        </Form>
    );
};

export default FormMessage;
