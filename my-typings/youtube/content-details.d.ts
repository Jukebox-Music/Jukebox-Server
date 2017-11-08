interface YoutubeVideoDetails {
    items: {
        id: string,
        contentDetails: YoutubeContentDetails,
    }[];
}

interface YoutubeContentDetails {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    projection: string;
}
