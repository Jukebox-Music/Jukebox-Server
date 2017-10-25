export const ProductionConfig: IConfig = {
    port: process.env.PORT || 9000,
    client: {
        url: "https://jukebox-music.github.io",
    },
    youtube: {
        apiKey: process.env.YOUTUBE_API_KEY,
    },
};
