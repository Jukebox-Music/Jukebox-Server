import { Request, Response, Router } from "express";
import * as logger from "winston";

import { SongDictionary } from "./song-dictionary";

export class SongRouter {
    public router: Router;
    private songDictionary: SongDictionary;

    constructor(config: IConfig) {
        this.router = Router();
        this.songDictionary = new SongDictionary();

        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            logger.debug("Getting song");
            const songUrl = req.query.url as string;
            this.songDictionary.load(songUrl).then((result) => {
                res.status(200).download(result.path, "song.mp3");
            });
        });
    }
}
