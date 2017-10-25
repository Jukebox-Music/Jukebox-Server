import * as logger from "winston";

import { RoomRouter } from "./api/room";
import { SearchRouter } from "./api/search";
import { StatusRouter } from "./api/status";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { SocketIOManager } from "./bootstrap/socket-io-manager";
import { DevelopmentConfig, ProductionConfig } from "./config";
import { SocketServer } from "./server";

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
    app.use("/room", new RoomRouter(config).router);
    app.use("/search", new SearchRouter(config).router);
});

const socketIoManager = new SocketIOManager(appWrapper.Server);

socketIoManager.start();

socketIoManager.configure((io) => {
    const socketServer = new SocketServer(io);
    socketServer.start();
});

appWrapper.start();
