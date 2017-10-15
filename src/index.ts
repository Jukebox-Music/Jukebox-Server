import * as logger from "winston";

import { StatusRouter } from "./api/status";
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
    app.use("/status", new StatusRouter(config).router);
});

appWrapper.start();
