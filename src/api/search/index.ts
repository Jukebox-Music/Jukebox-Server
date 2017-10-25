import { Request, Response, Router } from "express";
import * as _ from "lodash";
import * as logger from "winston";
import * as search from "youtube-search";

export class SearchRouter {
    public router: Router;

    constructor(private config: IConfig) {
        this.router = Router();

        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            logger.debug("Searching youtube for videos");
            const searchTerm = req.query.q as string | undefined;

            if (!searchTerm) {
                res.status(400).send();
                return;
            }

            search(searchTerm, {
                maxResults: 10,
                key: this.config.youtube.apiKey,
                type: "video",
            }, (err, results) => {
                if (err) {
                    return res.status(400).send(err);
                }

                const output = results.map((result) => {
                    return _.pick(result, ["link", "title", "thumbnails", "description"]);
                });

                res.status(200).json(output);
            });
        });
    }
}
