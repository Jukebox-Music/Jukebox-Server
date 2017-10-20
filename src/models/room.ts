import { PlayState } from "./play-state";
import { Song } from "./song";

export class Room {
    private songs: Song[];
    private playState: PlayState;

    constructor() {
        this.songs = [];
        this.playState = "stop";
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

}
