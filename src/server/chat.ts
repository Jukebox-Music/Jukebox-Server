import { Utility } from "./utility";

export class ChatServer {
    constructor(private io: SocketIO.Server) {
    }

    public init(socket: JukeboxSocket): void {
        socket.on("chat-request", (message: string) => {
            const roomName = Utility.getRoomName(socket);

            this.sendUpdateToRoom(roomName, {
                message: message,
                name: socket.user.name,
            });
        });
    }

    private sendUpdateToRoom(roomName: string, chatMessage: ChatMessage): void {
        this.io.in(roomName).emit("chat-response", chatMessage);
    }
}
