import { Request, Response, Router } from "express";
import { Presets, Pully } from "pully";
import * as logger from "winston";

import { SongDictionary } from "../../song-dictionary";

export class SongRouter {
    public router: Router;

    constructor(config: IConfig, private songDictionary: SongDictionary) {
        this.router = Router();

        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            logger.debug("Getting song");
            const songId = req.query.id as string;
            this.songDictionary.load(songId).then((result) => {
                res.status(200).download(result.path, "song.mp3");
            }).catch(() => {
                res.status(400).send();
            });
        });

        this.router.get("/test", (req: Request, res: Response) => {
            logger.debug("Getting server status");

            const pully = new Pully();

            pully.download({
                url: "https://www.youtube.com/watch?v=VfnYmGSE1aY",
                preset: Presets.MP3,
            }).then((results) => {
                res.status(200).download(results.path, "song.mp3");
            }, (err) => console.error(err),
            );
        });
    }
}
