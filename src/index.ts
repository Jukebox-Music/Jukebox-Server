import * as logger from "winston";

import { TipsRouter } from "./api/tips";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { DevelopmentConfig, ProductionConfig } from "./config";

let config;

switch (process.env.NODE_ENV) {
    case "dev":
        config = DevelopmentConfig;
        break;
    case "prod":
        config = ProductionConfig;
        break;
    default:
        config = DevelopmentConfig;
        break;
}

const appWrapper = new ApplicationWrapper(config);

appWrapper.configure((app) => {
    logger.debug("Configuring application routes");
    app.use("/tips", new TipsRouter(config).router);
});

appWrapper.start();
