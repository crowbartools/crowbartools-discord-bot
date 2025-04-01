import axios from 'axios';
import { config } from '../config';

export async function removePostFromFeed(
    postUrl: string
): Promise<{ success: boolean; errorMessage?: string }> {
    try {
        const response = await axios.delete(
            'https://atprotofeed.firebot.app/post',
            {
                params: {
                    postUrl,
                    token: config.firebot.atProtoFeedApiToken,
                },
            }
        );
        return {
            success: response?.status === 200,
            errorMessage: response?.data?.error,
        };
    } catch (error) {
        if (error && error.response) {
            return {
                success: false,
                errorMessage: error?.response?.data?.error,
            };
        } else {
            console.log('Error getting featured streams', error);
            return {
                success: false,
                errorMessage: 'An error occurred removing post from feed',
            };
        }
    }
}
