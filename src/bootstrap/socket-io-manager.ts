import * as http from "http";
import * as io from "socket.io";

export class SocketIOManager {
    private io: SocketIO.Server;

    constructor(private server: http.Server) {
    }

    public start(): void {
        this.io = io.listen(this.server);
    }

    public configure(func: (io: SocketIO.Server) => void = () => null): void {
        func(this.io);
    }
}
