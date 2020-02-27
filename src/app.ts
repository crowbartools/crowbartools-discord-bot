import dotenv from 'dotenv';
import * as bot from './bot/commands/bot';

import { registerCommand } from './bot/commands/command-manager';
import PingCommand from './bot/commands/types/ping';
import v5UpdatesCommand from './bot/commands/types/v5-updates';
import CreateGHIssueCommand from './bot/commands/types/create-github-issue';

function verifyEnvironment(): boolean {
    const envResult = dotenv.config();

    if (envResult.error) {
        console.error('Could not find a .env file in root folder of repo. Contact ebiggz to get a copy.');
        return false;
    }

    const expectedKeys = ['DISCORD_TOKEN', 'GITHUB_USER', 'GITHUB_TOKEN'];
    let keyMissing = false;
    for (const key of expectedKeys) {
        if (envResult.parsed[key] == null) {
            console.error(`Could not find key ${key} in .env file.`);
            keyMissing = true;
        }
    }
    if (keyMissing) {
        return false;
    }

    return true;
}

function start(): void {
    // verify environment config is setup properly
    if (!verifyEnvironment()) {
        process.exit();
    }

    // register our command types
    registerCommand(PingCommand);
    registerCommand(v5UpdatesCommand);
    registerCommand(CreateGHIssueCommand);

    // connect to discord
    bot.init();
}

start();
