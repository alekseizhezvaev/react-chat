const {
    ROOM_JOIN,
    ROOM_SET_USERS,
    ROOM_NEW_MESSAGE,
} = require("@chat/common/src/constants");
const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(express.json());

const rooms = new Map();

//По get запросу получаем юзеров
app.get("/rooms/:id", (req, res) => {
    const { id: roomId } = req.params;
    if (!roomId) {
        res.sendStatus(404);
        return;
    }
    const room = rooms.has(roomId)
        ? {
              users: [...rooms.get(roomId).get("users").values()],
              messages: [...rooms.get(roomId).get("messages").values()],
          }
        : { users: [], messages: [] };

    res.json(room);
});
//post запрос на создание комнаты в базе данных
app.post("/rooms", (req, res) => {
    const { roomId } = req.body;
    if (!roomId) {
        res.sendStatus(404);
        return;
    }
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ["users", new Map()],
                ["messages", []],
            ])
        );
    }
    res.sendStatus(200);
});

io.on("connection", (socket) => {
    socket.on(ROOM_JOIN, ({ roomId, userName }) => {
        //Подключаемся к сокету в определённую комнату
        socket.join(roomId);
        //Сохраняем в нашей базе данных пользователя
        rooms.get(roomId).get("users").set(socket.id, userName);
        //Получили список всех пользователей в определенной комнате
        const users = [...rooms.get(roomId).get("users").values()];
        //В определенную комнату всем кроме меня отправляется сокет запрос ROOM:SET_USERS
        socket.to(roomId).broadcast.emit(ROOM_SET_USERS, users);
    });

    socket.on(ROOM_NEW_MESSAGE, ({ roomId, userName, text, date }) => {
        const message = {
            userName,
            text,
            date,
        };
        //Сохраняем в нашей базе данных сообщение
        rooms.get(roomId).get("messages").push(message);
        //В определенную комнату всем кроме меня отправляется сокет запрос ROOM_NEW_MESSAGE
        socket.to(roomId).broadcast.emit(ROOM_NEW_MESSAGE, message);
    });

    socket.on("disconnect", () => {
        rooms.forEach((value, roomId) => {
            //Удаляется комната при дисконнекте всех юзеров
            if (value.get("users").size === 0) {
                rooms.delete(roomId);
                return;
            } //Удалятся пользователь с базы данных при дисконекте
            if (value.get("users").delete(socket.id)) {
                const users = [...value.get("users").values()];
                socket.to(roomId).emit(ROOM_SET_USERS, users);
            }
        });
    });
});

const port = 8080;

server.listen(port, (err) => {
    if (err) {
        throw Error(err);
    }
    console.log(`Сервер запущен, port: ${port}`);
});
