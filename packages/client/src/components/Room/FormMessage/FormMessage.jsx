import React, { useState, useContext } from "react";
import classes from "./FormMessage.module.css";
import { Form, TextArea, Button } from "semantic-ui-react";
import { Context } from "../../../context";
import { useCallback } from "react";

const FormMessage = () => {
    const [message, setMessage] = useState("");
    const { onAddMessage } = useContext(Context);

    //Функция для отправки сообщения
    const onSendMessage = useCallback(
        (event) => {
            event.preventDefault();
            if (!message.trim()) {
                return;
            }

            onAddMessage(message);

            setMessage("");
        },
        [onAddMessage, message]
    );

    const handleChangeMessage = useCallback((event) => {
        setMessage(event.target.value);
    }, []);

    return (
        <Form className={classes.FormMessage} onSubmit={onSendMessage}>
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
