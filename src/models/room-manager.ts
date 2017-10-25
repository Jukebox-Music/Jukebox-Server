import { Room } from "./room";

export class RoomManager {

    constructor(private socketRooms: any) {
    }

    public addRoomIfNotExists(roomName: string): void {
        if (this.socketRooms[roomName].room) {
            return;
        }

        this.socketRooms[roomName].room = new Room();
    }
}
