import * as logger from "winston";

import { RoomManager } from "../models/room-manager";
import { SongDictionary } from "../song-dictionary";

export class SongServer {
    constructor(private songDictionary: SongDictionary, private roomManager: RoomManager) {
    }

    public init(socket: JukeboxSocket): void {
        let currentRoomName: string;

        socket.on("join", (roomName: string) => {
            currentRoomName = roomName;
            logger.info(`User ${socket.client.id} is attempting to join room ${roomName}`);
            socket.leaveAll();
            socket.join(roomName);
            this.roomManager.addRoomIfNotExists(roomName);
            this.roomManager.emitToAll();
            this.roomManager.emitUpdate(roomName);
        });

        socket.on("leave", () => {
            logger.info(`User ${socket.client.id} left`);
            socket.leaveAll();
            this.roomManager.emitToAll();
            this.roomManager.emitUpdate(currentRoomName);
        });

        socket.on("add-song", (data: SongData) => {
            logger.info(`User ${socket.client.id} is adding song to room`);

            this.songDictionary.save(data.link).then((id) => {
                logger.info(`User ${socket.client.id} is added song to room`);

                this.roomManager.addSong(currentRoomName, data, id);
                this.roomManager.emitUpdate(currentRoomName);
            });
        });

        socket.on("song-state", (data: SongState) => {
            this.roomManager.updateState(currentRoomName, data);
            this.roomManager.emitUpdate(currentRoomName);
        });

        socket.on("song-order", (data: SongOrder) => {
            this.roomManager.reOrderSong(currentRoomName, data.oldIndex, data.newIndex);
            this.roomManager.emitUpdate(currentRoomName);
        });

        socket.on("disconnect", (data) => {
            this.roomManager.emitUpdate(currentRoomName);
        });
    }
}
