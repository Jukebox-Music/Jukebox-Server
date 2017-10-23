import * as logger from "winston";

import { RoomRouter } from "./api/room";
import { StatusRouter } from "./api/status";
import { ApplicationWrapper } from "./bootstrap/application-wrapper";
import { SocketIOManager } from "./bootstrap/socket-io-manager";
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
    app.use("/room", new RoomRouter(config).router);
});

const socketIoManager = new SocketIOManager(appWrapper.Server);

socketIoManager.start();

socketIoManager.configure((io) => {
    io.on("connection", (socket: SocketIO.Socket) => {
        socket.on("join", (data) => {
            logger.info(`User ${socket.client.id} connected`);
            socket.leaveAll();
            socket.join(data);
        });

        socket.on("leave", () => {
            logger.info(`User ${socket.client.id} left`);
        });

        socket.on("disconnect", (data) => {
            logger.info(`User ${socket.client.id} disconnected. Destroying all services assigned to this user`);
        });
    });
});

appWrapper.start();
