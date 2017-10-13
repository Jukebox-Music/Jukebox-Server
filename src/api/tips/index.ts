import { MaterialGrabber } from "@dolan-bio/tips";
import { Request, Response, Router } from "express";
import * as logger from "winston";

export class TipsRouter {
    public router: Router;
    private materialGrabber: MaterialGrabber;

    constructor(config: IConfig) {
        this.router = Router();
        this.materialGrabber = new MaterialGrabber();

        this.init();
    }

    public init(): void {
        this.router.get("/", (req: Request, res: Response) => {
            logger.debug("Getting tip");
            const tip = this.materialGrabber.grabTip();

            res.status(200).json(tip);
        });
    }
}
