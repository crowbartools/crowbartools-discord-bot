import axios from 'axios';
import { objectToCamel } from 'ts-case-convert';

export async function getRandomFeaturedStream() {
    const featuredStreamsUrl = `https://firebot.app/api/featured`;

    try {
        const response = await axios.get<FeaturedStream>(featuredStreamsUrl);
        if (response && response.status === 200 && response.data) {
            return objectToCamel(response.data);
        }
    } catch (error) {
        console.log('Error getting featured streams', error);
    }

    return null;
}

type FeaturedStream = {
    id: string;
    login: string;
    display_name: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: string;
    stream: {
        id: string;
        user_id: string;
        user_login: string;
        user_name: string;
        game_name: string;
        title: string;
        viewer_count: number;
        started_at: string;
        thumbnail_url: string;
        tags: string[];
        is_mature: boolean;
    };
};
