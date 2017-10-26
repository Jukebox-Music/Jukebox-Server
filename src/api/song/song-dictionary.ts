import * as fs from "fs";
import { DownloadResults } from "pully";

import { SongDownloader } from "./song-downloader";

export class SongDictionary {
    private downloader: SongDownloader;
    private songs: Map<string, DownloadResults>;

    constructor() {
        this.downloader = new SongDownloader();
        this.songs = new Map<string, DownloadResults>();
    }

    public load(link: string): Promise<DownloadResults> {
        return new Promise<DownloadResults>((resolve, reject) => {
            Promise.all([!!this.songs.get(link), this.checkIfFileExits(link)]).then((result) => {
                const [inMap, exists] = result;

                console.log(inMap);
                console.log(exists);

                if (!inMap || !exists) {
                    this.downloader.download(link).then((downloadResult) => {
                        this.songs.set(link, downloadResult);
                        resolve(downloadResult);
                    });
                } else {
                    resolve(this.songs.get(link));
                }
            }).catch((err) => reject);
        });
    }

    private checkIfFileExits(fileName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.stat(fileName, (err, stat) => {
                if (!err) {
                    resolve(true);
                    return;
                }

                console.log(err);

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
