interface SongDataThumbnail {
    url: string;
    width: number;
    height: number;
}

interface SongData {
    link: string;
    title: string;
    thumbnails: {
        default: SongDataThumbnail,
        medium: SongDataThumbnail,
        high: SongDataThumbnail,
    };
    description: string;
    duration: number;
}
