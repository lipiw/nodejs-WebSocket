import { Socket } from 'socket.io';
import { io } from './http';        //chat.js -> Cliente / socket.ts -> servidor

interface RoomUser {
    socket_id: string,
    username: string,
    room: string
}

interface Message{
    room: string,
    text: string,
    createdAt:Date,
    username: string
}

const users: RoomUser[] = [];

const messages: Message[] = [];

// Toda vez que um cliente connectar em nossa SERVIDOR sera gerado um socket
io.on("connection", socket =>{

    //utilizo o socket quando é algo mais especifico.
    //caso fosse para todos ususarios poderia usar o "io."
    socket.on("select_room", (data, callback) =>{
        socket.join(data.room);

        const userInRoom = users.find(user => user.username === data.username && user.room === data.room);

        if(userInRoom){
            userInRoom.socket_id = socket.id;
        }else{
            users.push({
                room: data.room,
                username: data.username,
                socket_id: socket.id
            });
        }

        const messagesRoom = getMessagesRoom(data.room);
        callback(messagesRoom);
    });

    socket.on("message", data =>{
        //Criando mensagem
        const message: Message={
            room: data.room,
            username: data.username,
            text:data.message,
            createdAt: new Date()
        }

        messages.push(message);

        //Enviar para os usuarios da sala
        io.to(data.room).emit("message", message);
    });
});

function getMessagesRoom(room: string){
    const messagesRoom = messages.filter(message => message.room === room);

    return messagesRoom;
}

