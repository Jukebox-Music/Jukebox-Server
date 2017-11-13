import { Song } from "./song";

export class Room {
    private songs: Song[];
    private history: Song[];
    private playState: PlayState;
    private timer: NodeJS.Timer;

    constructor(private name: string, private io: SocketIO.Server) {
        this.songs = [];
        this.history = [];
        this.playState = "pause";
    }

    public start(): void {
        const resolution = 100;
        this.timer = setInterval(() => {
            this.update(resolution);
        }, resolution);
    }

    public destroy(): void {
        clearInterval(this.timer);
    }

    public addSong(song: Song): void {
        this.songs.push(song);
    }

    public play(): void {
        this.playState = "play";
    }

    public pause(): void {
        this.playState = "pause";
    }

    public updateState(state: SongState): void {
        this.playState = state.type;

        if (!this.CurrentSong) {
            return;
        }

        this.CurrentSong.Seek = state.seek;
    }

    public emitUpdate(): void {
        this.io.in(this.name).emit("room", {
            songs: this.songs,
            history: this.history,
            playState: this.playState,
            name: this.name,
            totalUsers: this.TotalUsers,
        });
    }

    public removeSong(id: string): void {
        // TODO
    }

    public reOrderSong(index: number, newIndex: number): void {
        const song = this.songs.splice(index, 1)[0];

        this.songs.splice(newIndex, 0, song);
    }

    public nextSong(): void {
        const song = this.songs.shift();
        this.history.unshift(song);

        if (this.songs.length === 0) {
            this.playState = "pause";
        }

        this.emitUpdate();
    }

    private update(resolution: number): void {
        if (this.playState === "play") {
            if (!this.CurrentSong) {
                return;
            }

            this.CurrentSong.adjustSeek(resolution / 1000);

            if (this.CurrentSong.Finished) {
                console.log(`${this.CurrentSong.Data.title} finished playing`);
                this.nextSong();
            }
        }
    }

    private get CurrentSong(): Song {
        return this.songs[0];
    }

    private get TotalUsers(): number {
        return this.io.sockets.adapter.rooms[this.name].length;
    }

}
