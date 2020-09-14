import React, {
    createContext,
    useReducer,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";

import socket from "./socket";
import reducer from "./reducer";

const {
    ROOM_JOIN,
    ROOM_NEW_MESSAGE,
    ROOM_SET_USERS,
} = require("@chat/common/src/constants");

const initialState = {
    roomId: null,
    userName: null,
    users: [],
    messages: [],
};

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setMessages = useCallback(
        (message) => {
            dispatch({
                type: "NEW_MESSAGE",
                payload: message,
            });
        },
        [dispatch]
    );

    const setUsers = useCallback(
        (users) => {
            dispatch({ type: "SET_USERS", payload: users });
        },
        [dispatch]
    );

    const onLogin = useCallback(
        //Функция логина пользователя в комнату
        (payload) => {
            //Отправляем сокет запрос и данные комнаты и юзера
            socket.emit(ROOM_JOIN, payload);
            //Диспатчим комнату и юзера в initialState
            dispatch({ type: "JOINED", payload });
            //Получаем всех юзеров с данной комнаты
            axios.get(`/rooms/${payload.roomId}`).then(({ data }) => {
                //Диспатчим юзеров в initialState
                setUsers(data.users);
            });
        },
        [dispatch, setUsers]
    );

    const onAddMessage = useCallback(
        (message) => {
            //Время добавления сообщения
            const date = new Date();
            //Отправляем сокет запрос и данные сообщения
            socket.emit(ROOM_NEW_MESSAGE, {
                roomId: state.roomId,
                userName: state.userName,
                text: message,
                date: date.toLocaleString(),
            });
            //Диспатчим данные сообщения в initialState
            setMessages({
                userName: state.userName,
                text: message,
                date: date,
            });
        },
        [state.roomId, state.userName, setMessages]
    );

    useEffect(() => {
        //Получаем новых пользователей от сокета
        socket.on(ROOM_SET_USERS, (users) => {
            setUsers(users);
        });
        //Получаем новые сообщения от сокета
        socket.on(ROOM_NEW_MESSAGE, (messages) => {
            setMessages(messages);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = {
        ...state,
        onLogin,
        onAddMessage,
    };

    return <Context.Provider value={value}>{children}</Context.Provider>;
};
