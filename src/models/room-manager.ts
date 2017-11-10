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

    constructor(private socketRooms: ISocketRooms, private io: SocketIO.Server) {
    }

    public addRoomIfNotExists(roomName: string): void {
        if (this.socketRooms[roomName].room) {
            return;
        }

        this.socketRooms[roomName].room = new Room(roomName, this.io);
        this.socketRooms[roomName].room.start();
    }

    public addSong(roomName: string, data: SongData, id: string): void {
        const room = this.getRoom(roomName);

        if (!room) {
            return;
        }

        room.addSong(new Song(data, id, data.duration));
    }

    public updateState(roomName: string, state: SongState): void {
        const room = this.getRoom(roomName);

        if (!room) {
            return;
        }

        room.updateState(state);
    }

    public emitToAll(): void {
        this.io.emit("rooms", this.JsonRooms);
    }

    public emitUpdate(roomName: string): void {
        const room = this.getRoom(roomName);

        if (!room) {
            return;
        }

        room.emitUpdate();
    }

    private getRoom(roomName: string): Room {
        if (!this.Rooms[roomName]) {
            return undefined;
        }

        return this.Rooms[roomName].room as Room;
    }

    public get Rooms(): ISocketRooms {
        return _.pickBy(this.socketRooms, (value) => {
            return value.room;
        });
    }

    // tslint:disable:no-any
    public get JsonRooms(): any {
        const validRooms = this.Rooms;

        return _.mapValues(validRooms, (value, key) => {
            return {
                sockets: value.sockets,
                length: value.length,
                room: {
                    songs: (value.room as any).songs.slice(0, 3),
                    name: (value.room as any).name,
                },
            };
        });
    }
    // tslint:enable:no-any
}
