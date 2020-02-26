import { Client } from 'discord.js';
import commandManager from './commands/command-manager';

const discordClient = new Client();

/**
 * Logs into the discord server and starts listening for messages.
 */
export function init() {

    discordClient.on('ready', () => {
        console.log(`Logged in as ${discordClient.user.tag}!`);
    });
      
    discordClient.on('message', message => {
        // ignore messages from bots
        if (message.author.bot) return;

        commandManager.handleMessage(message);
    });
      
    discordClient.login(process.env.DISCORD_TOKEN);
}