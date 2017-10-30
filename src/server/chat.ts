import { Utility } from "./utility";

export class ChatServer {
    constructor(private io: SocketIO.Server) {
    }

    public init(socket: SocketIO.Socket): void {
        socket.on("chat", (message) => {
            const roomName = Utility.getRoomName(socket);

            this.sendUpdateToRoom(roomName, message);
        });
    }

    private sendUpdateToRoom(roomName: string, chatMessage: ChatMessage): void {
        this.io.in(roomName).emit("room", chatMessage);
    }
}
