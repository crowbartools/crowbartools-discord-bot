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
import { limitString } from '../common/util';
import NodeCache from 'node-cache';

const autoThreadCooldownCache = new NodeCache({ stdTTL: 30, checkperiod: 30 });

const BOT_APP_ID = '539509249726873600';
const CROWBAR_GUILD_ID = '372817064034959370';
// const CROWBAR_GUILD_ID = '428739554833334274'; // test server

const autoThreadChannels: Record<string, string> = {
    //questions channel
    '372818514312167424':
        "{user} Thanks for dropping by with your question! I've created this thread for follow up messages. We'll get to your question as soon as possible :)",
    //issues channel
    '911520084256768050':
        "{user} Sorry you are having an issue! I've created this thread for follow up messages. Any steps to reproduce and/or screenshots (if applicable) will be really helpful! We'll get to you as soon as possible :)",
};

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

    discordClient.on('messageCreate', async message => {
        // ignore messages from bots
        if (message.author.bot) return;

        if (message.guildId !== CROWBAR_GUILD_ID) return;

        // ignore messages in threads
        if (message.channel.isThread()) return;

        const autoThreadMessage = autoThreadChannels[message.channelId];
        if (autoThreadMessage) {
            const cooldownCacheKey = `${message.author.id}:${message.channelId}`;
            if (autoThreadCooldownCache.has(cooldownCacheKey)) return;

            autoThreadCooldownCache.set(cooldownCacheKey, true);

            const thread = await message.startThread({
                name: limitString(message.content, 30, '...'),
                autoArchiveDuration: 4320,
                reason: 'Auto-thread by CrowbarBot',
            });

            thread.send(
                autoThreadMessage.replace('{user}', `<@${message.author.id}>`)
            );
        }
    });

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

        const registeredCommands = getRegisteredApplicationCommands();

        // cleanup previously registered slash commands
        const knownAppCommands = (await interactionsClient.getCommands({
            guildID: CROWBAR_GUILD_ID,
        })) as ApplicationCommand[];

        const commandsToRemove = knownAppCommands.filter(
            appCommand =>
                !registeredCommands.some(c =>
                    c.applicationCommands?.some(
                        ac => ac.config.name === appCommand.name
                    )
                )
        );

        for (const command of commandsToRemove) {
            console.log('Attempting to delete command: ', command.name);
            try {
                await interactionsClient.deleteCommand(
                    command.id,
                    CROWBAR_GUILD_ID
                );
            } catch (error) {
                console.log('Failed to delete command: ', command.name);
                console.error(error);
            }
        }

        // create or update registered slash commands
        for (const command of registeredCommands) {
            for (const applicationCommandConfig of command.applicationCommands) {
                const existingCommand = knownAppCommands.find(
                    c => c.name === applicationCommandConfig.config.name
                );

                if (existingCommand != null) {
                    console.log(
                        'Attempting to update command: ',
                        applicationCommandConfig.config.name
                    );
                    try {
                        await interactionsClient.editCommand(
                            applicationCommandConfig.config,
                            existingCommand.id,
                            CROWBAR_GUILD_ID
                        );
                    } catch (error) {
                        console.log(
                            'Failed to update command: ',
                            applicationCommandConfig.config.name
                        );
                        console.error(error);
                    }
                } else {
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
        }
    });

    discordClient.login(process.env.DISCORD_TOKEN);
}
