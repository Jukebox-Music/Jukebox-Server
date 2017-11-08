import { Song } from "./song";

export class Room {
    private songs: Song[];
    private playState: PlayState;
    private timer: NodeJS.Timer;

    constructor() {
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

    public removeSong(id: string): void {
        // TODO
    }

    public nextSong(): void {
        this.songs.shift();
    }

    private get CurrentSong(): Song {
        return this.songs[0];
    }

}
