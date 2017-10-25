import * as _ from "lodash";

import { Room } from "./room";
import { Song } from "./song";

interface ISocketRooms {
    [room: string]: {
        sockets: {
            [id: string]: boolean,
        },
        length: number,
        room?: Room,
    };
}

export class RoomManager {

    constructor(private socketRooms: ISocketRooms) {
    }

    public addRoomIfNotExists(roomName: string): void {
        if (this.socketRooms[roomName].room) {
            return;
        }

        this.socketRooms[roomName].room = new Room();
    }

    public addSong(roomName: string, data: SongData): void {
        const room = this.socketRooms[roomName].room as Room;

        room.addSong(new Song(data));
    }

    public get Rooms(): ISocketRooms {
        return _.pickBy(this.socketRooms, (value) => {
            return value.room;
        });
    }
}
