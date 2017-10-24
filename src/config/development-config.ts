export const DevelopmentConfig: IConfig = {
    port: process.env.PORT || 9000,
    client: {
        url: "http://localhost:4200",
    },
};
