import { SongData } from "./song-data";

export class Song {
    private seek: number;

    constructor(private data: SongData) {
        this.seek = 0;
    }

    public play(): void {
        // TODO
    }

    public pause(): void {
        // TODO
    }

    public get Data(): SongData {
        return this.data;
    }
}
