import { TextChannel } from 'discord.js';
import { ICommandType } from '../../types/command';

const command: ICommandType = {
    applicationCommands: [
        {
            config: {
                name: 'say',
                description: 'Make the bot say something',
                options: [
                    {
                        name: 'message',
                        description: 'The message the bot should say',
                        type: 3,
                        required: true,
                    },
                    {
                        name: 'channel',
                        description:
                            'The channel the message should be sent in. Blank for current channel',
                        type: 7,
                        required: false,
                    },
                ],
                // eslint-disable-next-line @typescript-eslint/camelcase
                default_permission: false,
            },
        },
    ],
    async handleInteraction(interaction, discordClient) {
        if (!interaction.isCommand()) return;

        interaction.deferReply({ ephemeral: true });

        const message = interaction.options.data.find(o => o.name === 'message')
            .value as string;

        const channelId =
            (interaction.options.data.find(o => o.name === 'channel')
                ?.value as string) ?? interaction.channel.id;

        const channel = discordClient.channels.cache.get(
            channelId
        ) as TextChannel;

        if (!channel.isText()) {
            interaction.reply({
                content: 'Message channel must be a text channel!',
                ephemeral: true,
            });
            return;
        }

        channel.send(message);

        interaction.reply({
            content: 'Message sent!',
            ephemeral: true,
        });
    },
};

export default command;
