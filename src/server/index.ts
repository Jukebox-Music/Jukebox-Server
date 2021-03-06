import * as logger from "winston";

import { RoomManager } from "../models/room-manager";
import { SongDictionary } from "../song-dictionary";
import { ChatServer } from "./chat";
import { SongServer } from "./song";
import { UserServer } from "./user";

export class SocketServer {
    private roomManager: RoomManager;

    constructor(private io: SocketIO.Server, private songDictionary: SongDictionary) {
        this.roomManager = new RoomManager(this.io.sockets.adapter.rooms, this.io);
    }

    public start(): void {
        this.io.on("connection", (socket: JukeboxSocket) => {
            logger.info(`User ${socket.client.id} connected`);
            socket.emit("rooms", this.roomManager.JsonRooms);

            const chat = new ChatServer(this.io);
            chat.init(socket);

            const song = new SongServer(this.songDictionary, this.roomManager);
            song.init(socket);

            const user = new UserServer();
            user.init(socket);

            socket.on("disconnect", (data) => {
                logger.info(`User ${socket.client.id} disconnected. Destroying all services assigned to this user`);
                this.roomManager.emitToAll();
            });
        });
    }
}
