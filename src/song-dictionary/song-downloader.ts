import * as logger from "winston";

import { DownloadResults, Presets, Pully } from "pully";

export class SongDownloader {

    public download(url: string): Promise<DownloadResults> {
        const pully = new Pully();

        return pully.download({
            url: url,
            preset: Presets.MP3,
            progress: (data) => logger.debug(data.percent + "%"),
        });
    }
}
