const { Server, Socket } = require("socket.io");
const PORT = process.env.PORT || 9000;
const io = new Server(PORT, {
    cors: {
        origin: "*"
    }
});

const RECEIVE_CONVERSATION = "receive-conv";
const RECEIVE_MESSAGE = "receive-message";
const SEND_CONVERSATION = "send-conv";
const SEND_MESSAGE = "send-message";

io.on("connection", (clientSocket) => {
    const id = clientSocket.handshake.query.id;
    clientSocket.join(id);
    console.log("Connected: " + clientSocket.id);

    // data = { conversationId, recipient, senderId, senderName, message}

    clientSocket.on(SEND_MESSAGE, (data) => {
        clientSocket.emit(RECEIVE_MESSAGE, data);
        clientSocket.to(data.recipient).emit(RECEIVE_MESSAGE, data);
        // console.log("Send message to user " + data.recipient + " from user " + clientSocket.id);
        // console.log(data);
    });

    clientSocket.on(SEND_CONVERSATION, (data) => {
        clientSocket.emit(RECEIVE_CONVERSATION, data);
        clientSocket.to(data.recipient).emit(RECEIVE_CONVERSATION, data);
        // console.log("Send conv to user " + data.recipient);
    });
});
