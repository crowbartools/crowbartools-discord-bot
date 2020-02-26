import dotenv from 'dotenv';
import * as bot from './bot';
import commandManager from './commands/command-manager';
import PingCommandType from './commands/types/ping';
import v5UpdatesCommandType from './commands/types/v5Updates';

function verifyEnvironment(): boolean {
    const envResult = dotenv.config();

    if(envResult.error) {
        console.error("Could not find a .env file in root folder of repo. Contact ebiggz to get a copy.");
        return false;
    }

    if(envResult.parsed["DISCORD_TOKEN"] == null) {
        console.error("Could not find key DISCORD_TOKEN in .env file.");
        return false;
    }

    return true;
}

function start(): void {
    // verify environment config is setup properly
    if(!verifyEnvironment()) {
        process.exit();
    }

    // register our command types
    commandManager.registerCommand(PingCommandType);
    commandManager.registerCommand(v5UpdatesCommandType);

    // connect to discord
    bot.init();
}

start();

