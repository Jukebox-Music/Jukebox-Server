import * as logger from "winston";

import { RoomManager } from "../models/room-manager";
import { SongDictionary } from "../song-dictionary";
import { Utility } from "./utility";

export class SongServer {
    constructor(private io: SocketIO.Server, private songDictionary: SongDictionary, private roomManager: RoomManager) {
    }

    public init(socket: JukeboxSocket): void {
        socket.on("join", (roomName: string) => {
            logger.info(`User ${socket.client.id} is attempting to join room ${roomName}`);
            socket.leaveAll();
            socket.join(roomName);
            this.roomManager.addRoomIfNotExists(roomName);
            this.sendUpdateToAllRooms();
            this.sendUpdateToRoom(roomName);
        });

        socket.on("add-song", (data: SongData) => {
            logger.info(`User ${socket.client.id} is adding song to room`);
            const roomName = Utility.getRoomName(socket);

            this.songDictionary.save(data.link).then((id) => {
                this.roomManager.addSong(roomName, data, id);
                this.sendUpdateToRoom(roomName);
                logger.info(`User ${socket.client.id} is added song to room`);
            });
        });

        socket.on("song-state", (data: SongState) => {
            const roomName = Utility.getRoomName(socket);

            this.roomManager.updateState(roomName, data);
            this.sendUpdateToRoom(roomName);
        });
    }

    private sendUpdateToRoom(roomName: string): void {
        this.io.in(roomName).emit("room", this.roomManager.Rooms[roomName]);
    }

    private sendUpdateToAllRooms(): void {
        this.io.emit("rooms", this.roomManager.Rooms);
    }
}
