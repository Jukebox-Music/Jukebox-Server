import * as _ from "lodash";
import * as logger from "winston";

import { RoomManager } from "./models/room-manager";
import { SongDictionary } from "./song-dictionary";

export class SocketServer {
    private roomManager: RoomManager;

    constructor(private io: SocketIO.Server, private songDictionary: SongDictionary) {
        this.roomManager = new RoomManager(this.io.sockets.adapter.rooms);
    }

    public start(): void {
        this.io.on("connection", (socket: SocketIO.Socket) => {
            logger.info(`User ${socket.client.id} connected`);
            socket.emit("rooms", this.roomManager.Rooms);
            console.log(this.roomManager.Rooms);

            socket.on("join", (roomName: string) => {
                logger.info(`User ${socket.client.id} is attempting to join room ${roomName}`);
                socket.leaveAll();
                socket.join(roomName);
                this.roomManager.addRoomIfNotExists(roomName);
                this.sendUpdateToRoom(roomName);
            });

            socket.on("add-song", (data: SongData) => {
                logger.info(`User ${socket.client.id} is adding song to room`);
                const roomName = _.keys(socket.rooms)[0];
                this.songDictionary.save(data.link).then((result) => {
                    this.roomManager.addSong(_.keys(socket.rooms)[0], data, result);
                    this.sendUpdateToRoom(roomName);
                });

            });

            socket.on("leave", () => {
                logger.info(`User ${socket.client.id} left`);
            });

            socket.on("disconnect", (data) => {
                logger.info(`User ${socket.client.id} disconnected. Destroying all services assigned to this user`);
            });
        });
    }

    private sendUpdateToRoom(roomName: string): void {
        this.io.in(roomName).emit("room", this.roomManager.Rooms[roomName]);
    }
}
