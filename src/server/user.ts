export class UserServer {
    public init(socket: JukeboxSocket): void {
        socket.user = {};

        socket.on("set-user", (user) => {
            socket.user = user;
        });
    }
}
