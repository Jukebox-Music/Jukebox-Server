import { Request, Response, Router } from "express";
import * as _ from "lodash";
import * as request from "request";
import * as logger from "winston";
import * as search from "youtube-search";

interface IExtendedYouTubeSearchResult extends search.YouTubeSearchResults {
    duration: number;
}

export class SearchRouter {
    public router: Router;

    constructor(private config: IConfig) {
        this.router = Router();

        this.init();
    }

    public init(): void {
        this.router.get("/", async (req: Request, res: Response) => {
            logger.debug("Searching youtube for videos");
            const searchTerm = req.query.q as string | undefined;

            if (!searchTerm) {
                res.status(400).send();
                return;
            }

            try {
                const results = await this.search(searchTerm);
                const newResults = await this.getDuration(results);

                const output = newResults.map((result) => {
                    return _.pick(result, ["link", "title", "thumbnails", "description", "duration"]) as SongData;
                });

                res.status(200).json(output);
            } catch (err) {
                res.status(500).send(err);
            }
        });
    }

    private search(searchTerm: string): Promise<search.YouTubeSearchResults[]> {
        return new Promise<search.YouTubeSearchResults[]>((resolve, reject) => {
            search(searchTerm, {
                maxResults: 10,
                key: this.config.youtube.apiKey,
                type: "video",
            }, (err, results) => {
                if (err) {
                    return reject(err);
                }

                resolve(results);
            });
        });
    }

    private getDuration(videoResults: search.YouTubeSearchResults[]): Promise<IExtendedYouTubeSearchResult[]> {
        const finalSearchResults = [];
        const ids = _.map(_.filter(videoResults, (r) => r.kind === "youtube#video"), (r) => {
            return r.id;
        });

        return new Promise<IExtendedYouTubeSearchResult[]>((resolve, reject) => {
            request.get({
                url: `https://www.googleapis.com/youtube/v3/videos?id=${ids.join(",")}&part=contentDetails&key=${this.config.youtube.apiKey}`,
                json: true,
            }, (err, res, body: YoutubeVideoDetails) => {
                if (err) {
                    reject(err);
                    return;
                }

                _.forEach(body.items, (r) => {
                    const video = _.find(videoResults, { id: r.id }) as IExtendedYouTubeSearchResult;
                    if (r.id) {
                        video.duration = this.getSecondsFromYoutubeTime(r.contentDetails.duration);

                        finalSearchResults.push(video);
                    }
                });

                resolve(finalSearchResults);
            });
        });
    }

    private getSecondsFromYoutubeTime(youtubeTime: string): number {
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(\d+)S/ig;

        const [, hour, minute, seconds] = regex.exec(youtubeTime);

        const hourMillis = hour ? parseInt(hour, 10) * 60 * 60 : 0;
        const minuteMillis = minute ? parseInt(minute, 10) * 60 : 0;
        const secondMillis = seconds ? parseInt(seconds, 10) : 0;

        return hourMillis + minuteMillis + secondMillis;
    }
}
