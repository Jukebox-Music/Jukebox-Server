import * as logger from "winston";

import { RoomManager } from "../models/room-manager";
import { SongDictionary } from "../song-dictionary";
import { Utility } from "./utility";

export class SongServer {
    constructor(private songDictionary: SongDictionary, private roomManager: RoomManager) {
    }

    public init(socket: JukeboxSocket): void {
        socket.on("join", (roomName: string) => {
            logger.info(`User ${socket.client.id} is attempting to join room ${roomName}`);
            socket.leaveAll();
            socket.join(roomName);
            this.roomManager.addRoomIfNotExists(roomName);
            this.roomManager.emitToAll();
            this.roomManager.emitUpdate(roomName);
        });

        socket.on("add-song", (data: SongData) => {
            logger.info(`User ${socket.client.id} is adding song to room`);
            const roomName = Utility.getRoomName(socket);

            this.songDictionary.save(data.link).then((id) => {
                logger.info(`User ${socket.client.id} is added song to room`);
                this.roomManager.addSong(roomName, data, id);
                this.roomManager.emitUpdate(roomName);
            });
        });

        socket.on("song-state", (data: SongState) => {
            const roomName = Utility.getRoomName(socket);

            this.roomManager.updateState(roomName, data);
            this.roomManager.emitUpdate(roomName);
        });
    }
}
