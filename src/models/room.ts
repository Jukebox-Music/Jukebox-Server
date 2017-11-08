import { Song } from "./song";

export class Room {
    private songs: Song[];
    private playState: PlayState;
    private timer: NodeJS.Timer;

    constructor(private name: string, private io: SocketIO.Server) {
        this.songs = [];
        this.playState = "pause";
    }

    public start(): void {
        const resolution = 1000;
        this.timer = setInterval(() => {
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
            playState: this.playState,
            name: this.name,
        });
    }

    public removeSong(id: string): void {
        // TODO
    }

    public nextSong(): void {
        this.songs.shift();
        this.emitUpdate();
    }

    private get CurrentSong(): Song {
        return this.songs[0];
    }

}
