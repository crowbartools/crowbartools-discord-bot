import dotenv from 'dotenv';

class BotConfig {
    get discord() {
        return {
            botAppId: process.env.DISCORD_BOT_APP_ID,
            serverGuildId: process.env.DISCORD_GUILD_ID,
            token: process.env.DISCORD_TOKEN,
            channels: {
                questions: process.env.DISCORD_QUESTIONS_CHANNEL_ID,
                issues: process.env.DISCORD_ISSUES_CHANNEL_ID,
            },
        };
    }
    get github() {
        return {
            user: process.env.GITHUB_USER,
            token: process.env.GITHUB_TOKEN,
        };
    }
    get openai() {
        return {
            enabled: process.env.OPENAI_API_KEY != null,
            apiKey: process.env.OPENAI_API_KEY,
        };
    }
    get firebot() {
        return {
            atProtoFeedApiToken: process.env.ATPROTO_FEED_API_TOKEN,
        };
    }

    loadAndValidate() {
        const envResult = dotenv.config();

        if (envResult.error) {
            console.error(
                'Could not find a .env file in root folder of repo. Contact ebiggz to get a copy.'
            );
            return false;
        }

        const expectedKeys = [
            'DISCORD_BOT_APP_ID',
            'DISCORD_GUILD_ID',
            'DISCORD_QUESTIONS_CHANNEL_ID',
            'DISCORD_ISSUES_CHANNEL_ID',
            'DISCORD_TOKEN',
            'GITHUB_USER',
            'GITHUB_TOKEN',
        ];

        return expectedKeys.every((k) => {
            if (envResult.parsed[k] != null) {
                return true;
            }
            console.error(`Could not find key ${k} in .env file.`);
            return false;
        });
    }
}

export const config = new BotConfig();
