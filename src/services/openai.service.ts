import OpenAI from 'openai';
import { config } from '../config';
import { limitString } from '../util/strings';

let client: OpenAI;

function getClient() {
    if (!config.openai.enabled) {
        return null;
    }

    if (!client) {
        client = new OpenAI({
            apiKey: config.openai.apiKey,
        });
    }

    return client;
}

export async function getForumTitle(
    message: string,
    isQuestion?: boolean
): Promise<string> {
    const client = getClient();

    if (!client) {
        return trimTextForTitle(message);
    }

    if (message.length > 300) {
        message = limitString(message, 300);
    }

    try {
        const completion = await client.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You summarize Discord chat messages about a live streaming app called Firebot. You must turn the message into something suitable as a forum post title${isQuestion ? ' in the form of a question' : ''}. It must be 100 characters or less. Do not wrap with quotes, or use emojis, or include mentioned users / channels. Do not use title capitalization rules, write it like a normal sentence with grammar cleaned up and corrected. Only the F in Firebot is capitalized. Only reply with the summary and nothing else.`,
                },
                { role: 'user', content: message },
            ],
            model: 'gpt-4o-mini',
        });
        return trimTextForTitle(
            completion?.choices?.[0]?.message?.content ?? message
        );
    } catch (error) {
        console.error(error);
        return trimTextForTitle(message);
    }
}

function trimTextForTitle(message: string): string {
    if (message.length <= 100) {
        return message;
    }
    return limitString(message, 97, '...');
}
