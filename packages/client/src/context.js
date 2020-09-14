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
            socket.emit(ROOM_JOIN, payload); //Отправляем сокет запрос и данные комнаты и юзера
            dispatch({ type: "JOINED", payload }); //Диспатчим комнату и юзера в initialState
            axios.get(`/rooms/${payload.roomId}`).then(({ data }) => {
                //Получаем всех юзеров с данной комнаты
                console.log(data.users);
                
                setUsers(data.users); //Диспатчим юзеров в initialState
            });
        },
        [dispatch, setUsers]
    );

    const onAddMessage = useCallback(
        (message) => {
            const date = new Date(); //Время добавления сообщения
            socket.emit(ROOM_NEW_MESSAGE, {
                //Отправляем сокет запрос и данные сообщения
                roomId: state.roomId,
                userName: state.userName,
                text: message,
                date: date.toLocaleString(),
            });
            setMessages({
                //Диспатчим данные сообщения в initialState
                userName: state.userName,
                text: message,
                date: date,
            });
        },
        [state.roomId, state.userName, setMessages]
    );

    useEffect(() => {
        socket.on(ROOM_SET_USERS, (users) => {
            //Получаем новых пользователей от сокета
            setUsers(users);
        });
        socket.on(ROOM_NEW_MESSAGE, (messages) => {
            //Получаем новые сообщения от сокета
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
