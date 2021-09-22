import { Client, Intents } from 'discord.js';
import {
    handleMessage,
    handleInteraction,
    getRegisteredApplicationCommands,
} from './commands/command-manager';
import {
    Client as InteractionClient,
    ApplicationCommand,
} from 'discord-slash-commands-client';

const BOT_APP_ID = '539509249726873600';
//const CROWBAR_GUILD_ID = '372817064034959370';
const CROWBAR_GUILD_ID = '428739554833334274'; // test server

const discordClient = new Client({
    intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});

/**
 * Logs into the discord server and starts listening for messages.
 */
export function init(): void {
    const interactionsClient = new InteractionClient(
        process.env.DISCORD_TOKEN,
        BOT_APP_ID
    );

    discordClient.on('ready', async () => {
        console.log(`Logged in as ${discordClient.user.tag}!`);

        // cleanup previously registered slash commands
        const slashCommands = (await interactionsClient.getCommands({
            guildID: CROWBAR_GUILD_ID,
        })) as ApplicationCommand[];

        for (const command of slashCommands) {
            await interactionsClient.deleteCommand(
                command.id,
                CROWBAR_GUILD_ID
            );
        }

        // register slash commands
        const commandsWithApplicationCommands = getRegisteredApplicationCommands();
        for (const command of commandsWithApplicationCommands) {
            for (const applicationCommandConfig of command.applicationCommands) {
                try {
                    const createdAppCommand = await interactionsClient.createCommand(
                        applicationCommandConfig.config,
                        CROWBAR_GUILD_ID
                    );

                    if (applicationCommandConfig.permissions != null) {
                        await interactionsClient.editCommandPermissions(
                            applicationCommandConfig.permissions,
                            CROWBAR_GUILD_ID,
                            createdAppCommand.id
                        );
                    }
                } catch (error) {
                    console.error(error);
                }
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
        handleInteraction(interaction, discordClient);
    });

    discordClient.login(process.env.DISCORD_TOKEN);
}
