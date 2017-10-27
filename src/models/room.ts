import { Song } from "./song";

export class Room {
    private songs: Song[];
    private playState: PlayState;
    private timer: NodeJS.Timer;

    constructor() {
        this.songs = [];
        this.playState = "stop";
    }

    public start(): void {
        const resolution = 500;
        this.timer = setInterval(() => {
            if (this.playState === "play") {
                if (!this.CurrentSong) {
                    return;
                }

                this.CurrentSong.adjustSeek(resolution);

                if (this.CurrentSong.Finished) {
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

    public stop(): void {
        this.playState = "stop";
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
