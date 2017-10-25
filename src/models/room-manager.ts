import * as _ from "lodash";

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

    public get Rooms(): void {
        return _.pickBy(this.socketRooms, (value) => {
            return value.room;
        });
    }
}
