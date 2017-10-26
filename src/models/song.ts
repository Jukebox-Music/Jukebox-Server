export class Song {
    private seek: number;

    constructor(private data: SongData, private id: string, private duration: number) {
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

    public get Id(): string {
        return this.id;
    }

    public get Duration(): number {
        return this.duration;
    }
}
