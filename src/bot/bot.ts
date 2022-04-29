import { Client, Intents } from 'discord.js';
import {
    handleInteraction,
    getRegisteredApplicationCommands,
    handleModalSubmit,
} from './commands/command-manager';
import {
    ApplicationCommand,
    Client as InteractionClient,
} from 'discord-slash-commands-client';
import { ModalSubmitInteraction } from 'discord-modals';

const BOT_APP_ID = '539509249726873600';
const CROWBAR_GUILD_ID = '372817064034959370';
//const CROWBAR_GUILD_ID = '428739554833334274'; // test server

const myIntents = new Intents();
myIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
);

const discordClient = new Client({
    intents: myIntents,
    partials: ['MESSAGE', 'CHANNEL', 'USER'],
});

/**
 * Logs into the discord server and starts listening for messages.
 */
export function init(): void {
    const interactionsClient = new InteractionClient(
        process.env.DISCORD_TOKEN,
        BOT_APP_ID
    );

    // discordClient.on('messageCreate', message => {
    //     // ignore messages from bots
    //     if (message.author.bot) return;

    //     handleMessage(message);
    // });

    discordClient.ws.on('INTERACTION_CREATE', data => {
        if (!data.type) return;

        switch (data.type) {
            case 5:
                discordClient.emit(
                    'modalSubmit',
                    new ModalSubmitInteraction(discordClient, data)
                );
                break;
        }
    });

    discordClient.on(
        'modalSubmit',
        async (interaction: ModalSubmitInteraction) => {
            handleModalSubmit(interaction);
        }
    );

    // attach and event listener for the interactionCreate event
    discordClient.on('interactionCreate', async interaction => {
        handleInteraction(interaction, discordClient, interactionsClient);
    });

    discordClient.on('ready', async () => {
        console.log(`Logged in as ${discordClient.user.tag}!`);

        const commandsWithApplicationCommands = getRegisteredApplicationCommands();

        // cleanup previously registered slash commands
        const slashCommandsOnDiscord = (await interactionsClient.getCommands({
            guildID: CROWBAR_GUILD_ID,
        })) as ApplicationCommand[];

        for (const command of slashCommandsOnDiscord) {
            console.log('Attempting to delete command: ', command.name);
            try {
                if (
                    !commandsWithApplicationCommands.some(c =>
                        c.applicationCommands.some(
                            ap => ap.config.name === command.name
                        )
                    )
                ) {
                    // await interactionsClient.deleteCommand(
                    //     command.id,
                    //     CROWBAR_GUILD_ID
                    // );
                }
            } catch (error) {
                console.log('Failed to delete command: ', command.name);
                console.error(error);
            }
        }

        // register slash commands
        for (const command of commandsWithApplicationCommands) {
            for (const applicationCommandConfig of command.applicationCommands) {
                console.log(
                    'Attempting to create command: ',
                    applicationCommandConfig.config.name
                );
                try {
                    await interactionsClient.createCommand(
                        applicationCommandConfig.config,
                        CROWBAR_GUILD_ID
                    );
                } catch (error) {
                    console.log(
                        'Failed to create command: ',
                        applicationCommandConfig.config.name
                    );
                    console.error(error);
                }
            }
        }
    });

    discordClient.login(process.env.DISCORD_TOKEN);
}
