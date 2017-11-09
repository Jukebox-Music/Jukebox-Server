import * as cors from "cors";
import * as logger from "winston";

import { SearchRouter } from "./api/search";
import { SongRouter } from "./api/song";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { SocketIOManager } from "./bootstrap/socket-io-manager";
import { DevelopmentConfig, ProductionConfig } from "./config";
import { SocketServer } from "./server";
import { SongDictionary } from "./song-dictionary";

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

const songDictionary = new SongDictionary();

appWrapper.configure((app) => {
    app.use(cors());
    logger.debug("Configuring application routes");
    app.use("/search", new SearchRouter(config).router);
    app.use("/song", new SongRouter(config, songDictionary).router);
});

const socketIoManager = new SocketIOManager(appWrapper.Server);

socketIoManager.start();

socketIoManager.configure((io) => {
    const socketServer = new SocketServer(io, songDictionary);
    socketServer.start();
});

appWrapper.start();
