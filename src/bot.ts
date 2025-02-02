import {
    ActivityType,
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
} from 'discord.js';
import { config } from './config';
import { commandManager } from './interactions/commands/command-manager';
import { modalManager } from './interactions/modals/modal-manager';
import { IInteractionManager } from './interactions/interaction-manager.interface';
import { messageComponentManager } from './interactions/message-components/message-component.manager';

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates, // Needed to track users in voice channels
    ],
    partials: [Partials.Message, Partials.Channel, Partials.User],
    presence: {
        status: 'online',
        activities: [
            {
                name: 'Firebot',
                type: ActivityType.Custom,
                state: 'Stream with Firebot 🔥',
            },
        ],
    },
});

const interactionManagers: IInteractionManager[] = [
    commandManager,
    modalManager,
    messageComponentManager,
];

export async function init(): Promise<void> {
    for (const manager of interactionManagers) {
        manager.loadHandlers();
    }

    discordClient.once(Events.ClientReady, (readyClient) => {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    });

    discordClient.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.guildId !== config.discord.serverGuildId) {
            // Ignore interactions from other guilds
            return;
        }

        try {
            for (const manager of interactionManagers) {
                if (manager.interactionTypes.includes(interaction.type)) {
                    await manager.handleInteraction(interaction);
                }
            }
        } catch (error) {
            console.error(error);

            if (interaction.isAutocomplete()) {
                return;
            }

            if (interaction.replied || interaction.deferred) {
                interaction
                    .followUp({
                        content:
                            'Sorry, there was a problem with this command - please let the Crowbar team know.',
                        ephemeral: true,
                    })
                    .catch(console.error);
            } else {
                interaction
                    .reply({
                        content:
                            'Sorry, there was a problem with this command - please let the Crowbar team know.',
                        ephemeral: true,
                    })
                    .catch(console.error);
            }
        }
    });

    const discordApi = new REST().setToken(config.discord.token);

    await discordApi.put(
        Routes.applicationGuildCommands(
            config.discord.botAppId,
            config.discord.serverGuildId
        ),
        {
            body: commandManager
                .getRegisteredCommandHandlers()
                .map((c) => c.config.toJSON()),
        }
    );

    discordClient.login(config.discord.token);
}
