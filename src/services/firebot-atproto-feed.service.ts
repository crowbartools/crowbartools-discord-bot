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
            console.log('Error removing post from feed', error);
            return {
                success: false,
                errorMessage: 'An error occurred removing post from feed',
            };
        }
    }
}

export async function addPostToFeed(
    postUrl: string
): Promise<{ success: boolean; errorMessage?: string }> {
    try {
        const response = await axios.post(
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
            console.log('Error adding post to feed', error);
            return {
                success: false,
                errorMessage: 'An error occurred adding post to feed',
            };
        }
    }
}
