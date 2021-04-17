import { Client } from 'discord.js';
import {
    handleMessage,
    handleInteraction,
    getRegisteredSlashCommands,
} from './commands/command-manager';
import interactions from 'discord-slash-commands-client';

const BOT_APP_ID = '539509249726873600';
const CROWBAR_GUILD_ID = '372817064034959370';

const discordClient = new Client();

/**
 * Logs into the discord server and starts listening for messages.
 */
export function init(): void {
    const interactionsClient = new interactions.Client(
        process.env.DISCORD_TOKEN,
        BOT_APP_ID
    );

    discordClient.on('ready', async () => {
        console.log(`Logged in as ${discordClient.user.tag}!`);

        // cleanup previously registered slash commands
        const slashCommands = (await interactionsClient.getCommands({
            guildID: CROWBAR_GUILD_ID,
        })) as interactions.ApplicationCommand[];

        for (const command of slashCommands) {
            await interactionsClient.deleteCommand(
                command.id,
                CROWBAR_GUILD_ID
            );
        }

        // register slash commands
        const registeredSlashCommands = getRegisteredSlashCommands();
        for (const command of registeredSlashCommands) {
            try {
                const createdCommand = await interactionsClient.createCommand(
                    command.slashCommandConfig,
                    CROWBAR_GUILD_ID
                );

                if (command.slashCommandPermissions) {
                    await interactionsClient.editCommandPermissions(
                        command.slashCommandPermissions,
                        CROWBAR_GUILD_ID,
                        createdCommand.id
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }
    });

    discordClient.on('message', message => {
        // ignore messages from bots
        if (message.author.bot) return;

        handleMessage(message);
    });

    // attach and event listener for the interactionCreate event
    discordClient.on('interactionCreate', async interaction => {
        handleInteraction(interaction);
    });

    discordClient.login(process.env.DISCORD_TOKEN);
}
