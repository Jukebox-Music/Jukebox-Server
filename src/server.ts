import * as _ from "lodash";
import * as logger from "winston";

import { RoomManager } from "./models/room-manager";

export class SocketServer {
    private roomManager: RoomManager;

    constructor(private io: SocketIO.Server) {
        this.roomManager = new RoomManager(this.io.sockets.adapter.rooms);
    }

    public start(): void {
        this.io.on("connection", (socket: SocketIO.Socket) => {
            logger.info(`User ${socket.client.id} connected`);
            socket.emit("rooms", this.roomManager.Rooms);
            console.log(this.roomManager.Rooms);

            socket.on("join", (roomName) => {
                logger.info(`User ${socket.client.id} is attempting to join room ${roomName}`);
                socket.leaveAll();
                socket.join(roomName);
                this.roomManager.addRoomIfNotExists(roomName);
                this.io.emit("rooms", this.roomManager.Rooms);
            });

            socket.on("add-song", (data) => {
                logger.info(`User ${socket.client.id} is adding song to room`);
                console.log(socket.rooms);
                this.roomManager.addSong(_.keys(socket.rooms)[0], data);
            });

            socket.on("leave", () => {
                logger.info(`User ${socket.client.id} left`);
            });

            socket.on("disconnect", (data) => {
                logger.info(`User ${socket.client.id} disconnected. Destroying all services assigned to this user`);
            });
        });
    }
}
