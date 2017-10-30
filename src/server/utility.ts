import * as _ from "lodash";

export class Utility {
    public static getRoomName(socket: SocketIO.Socket): string {
        return _.keys(socket.rooms)[0];
    }
}
