import * as _ from "lodash";

export class Utility {
    public static getRoomName(socket: JukeboxSocket): string {
        return _.keys(socket.rooms)[0];
    }
}
