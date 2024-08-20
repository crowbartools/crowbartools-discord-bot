import dotenv from 'dotenv';
import * as bot from './bot';

(() => {
    if (!verifyEnvironment()) {
        process.exit();
    }

    bot.init();
})();

function verifyEnvironment(): boolean {
    const envResult = dotenv.config();

    if (envResult.error) {
        console.error(
            'Could not find a .env file in root folder of repo. Contact ebiggz to get a copy.'
        );
        return false;
    }

    const expectedKeys = ['DISCORD_TOKEN', 'GITHUB_USER', 'GITHUB_TOKEN'];

    if (process.env.NODE_ENV !== 'production') {
        expectedKeys.push('TEST_SERVER_GUILD_ID');
    }

    return expectedKeys.every((k) => {
        if (envResult.parsed[k]) {
            return true;
        }
        console.error(`Could not find key ${k} in .env file.`);
    });
}
