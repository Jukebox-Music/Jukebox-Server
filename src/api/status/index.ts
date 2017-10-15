import { Request, Response, Router } from "express";
import { Presets, Pully } from "pully";
import * as logger from "winston";

export class StatusRouter {
    public router: Router;

    constructor(config: IConfig) {
        this.router = Router();

        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            logger.debug("Getting server status");

            const pully = new Pully();

            pully.download({
                url: "https://www.youtube.com/watch?v=ukn6K64C3MI",
                preset: Presets.MP3,
                progress: (data) => console.log(data.percent + "%"),
            }).then((results) => {
                console.log("Downloaded to " + results);
                res.status(200).download(results.path, "song.mp3");
            }, (err) => console.error(err),
            );
        });
    }
}
