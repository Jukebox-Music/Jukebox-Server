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
        name?: string;
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
        this.socketRooms[roomName].room.start();
    }

    public addSong(roomName: string, data: SongData, pullyData: IPullyData): void {
        const room = this.socketRooms[roomName].room as Room;

        room.addSong(new Song(data, pullyData.id, pullyData.duration));
    }

    public get Rooms(): ISocketRooms {
        const validRooms = _.pickBy(this.socketRooms, (value) => {
            return value.room;
        });

        const roomsWithName = _.mapValues(validRooms, (value, key) => {
            value.name = key;
            return value;
        });

        const roomsWithoutTimer = _.mapValues(roomsWithName, (value, key) => {
            // tslint:disable-next-line:no-any
            (value.room as any).timer = undefined;
            return value;
        });

        return roomsWithoutTimer;
    }
}
