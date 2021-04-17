import { TextChannel } from 'discord.js';
import { ICommandType } from '../../models/command';

const command: ICommandType = {
    triggers: ['!say'],
    description: 'Make the bot say something.',
    deleteTrigger: true,
    async execute(message, userCommand) {
        const isAdmin = message.member.roles.cache.find(
            c => c.name === 'Admin'
        );
        if (!isAdmin) return;

        const args = userCommand.args;
        if (args.length === 0) {
            return;
        }

        let replyChannel = message.channel;
        if (message.mentions.channels.size > 0) {
            replyChannel = message.mentions.channels.first();
            args.shift();
        }

        if (args.length > 0) {
            replyChannel.send(args.join(' '));
        }
    },
    supportsSlashCommands: true,
    slashCommandConfig: {
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
    slashCommandPermissions: [
        {
            type: 1,
            id: '372819709604921355', // Dev Role Id
            permission: true,
        },
    ],
    async handleInteraction(interaction, discordClient) {
        interaction.thinking(true);

        const message = interaction.options.find(o => o.name === 'message')
            .value;

        const channelId =
            interaction.options.find(o => o.name === 'channel')?.value ??
            interaction.channel.id;

        const channel = discordClient.channels.cache.get(
            channelId
        ) as TextChannel;

        if (!channel.isText()) {
            interaction.reply('Message channel must be a text channel!', true);
            return;
        }

        channel.send(message);

        interaction.reply('Message sent!', true);
    },
};

export default command;
