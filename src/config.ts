const BOT_APP_ID = '539509249726873600';
const CROWBAR_GUILD_ID = '372817064034959370';

class BotConfig {
    get discord() {
        return {
            botAppId: BOT_APP_ID,
            serverGuildId:
                process.env.NODE_ENV === 'production'
                    ? CROWBAR_GUILD_ID
                    : process.env.TEST_SERVER_GUILD_ID,
            token: process.env.DISCORD_TOKEN,
        };
    }
    get github() {
        return {
            user: process.env.GITHUB_USER,
            token: process.env.GITHUB_TOKEN,
        };
    }
}

export const config = new BotConfig();
