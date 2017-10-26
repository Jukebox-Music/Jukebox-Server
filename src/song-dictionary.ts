import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { DownloadResults } from "pully";

import { SongDownloader } from "./api/song/song-downloader";

export class SongDictionary {
    private downloader: SongDownloader;
    private songs: Map<string, DownloadResults>;

    constructor() {
        this.downloader = new SongDownloader();
        this.songs = new Map<string, DownloadResults>();
    }

    public load(songId: string): Promise<DownloadResults> {
        return new Promise<DownloadResults>((resolve, reject) => {
            Promise.all([!!this.songs.get(songId), this.checkIfFileExits(songId)]).then((result) => {
                const [inMap, exists] = result;

                if (!inMap || !exists) {
                    reject("Song not found");
                    return;
                }

                resolve(this.songs.get(songId));
            }).catch((err) => reject);
        });
    }

    public save(url: string): Promise<DownloadResults> {
        return new Promise<DownloadResults>((resolve, reject) => {
            this.downloader.download(url).then((downloadResult) => {
                this.songs.set(path.basename(downloadResult.path, ".mp3"), downloadResult);
                resolve(downloadResult);
            });
        });
    }

    private checkIfFileExits(songId: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const location = path.join(os.tmpdir(), `${songId}.mp3`);

            fs.stat(location, (err, stat) => {
                if (!err) {
                    resolve(true);
                    return;
                }

                if (err.code === "ENOENT") {
                    // File does not exist
                    resolve(false);
                } else {
                    throw new Error(err.toString());
                }
            });
        });
    }
}
