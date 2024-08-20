import { SlashCommandBuilder, TextChannel } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';

const config = new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption((builder) =>
        builder
            .setName('message')
            .setDescription('The message the bot should say')
            .setMinLength(3)
            .setRequired(false)
    )
    .addChannelOption((builder) =>
        builder
            .setName('channel')
            .setDescription(
                'The channel the message should be sent in. Blank for current channel'
            )
            .setRequired(false)
    )
    .setDefaultMemberPermissions(0);

export const saySlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const message = interaction.options.getString('message');

        const channelId =
            interaction.options.getChannel('channel')?.id ??
            interaction.channel.id;

        const channel = interaction.client.channels.cache.get(channelId);

        if (!channel.isTextBased()) {
            await interaction.followUp({
                content: 'Message channel must be a text channel!',
                ephemeral: true,
            });
            return;
        }

        const sentMessage = await channel.send(message);

        await interaction.followUp({
            content: `Message sent!\n${sentMessage.url}`,
            ephemeral: true,
        });
    },
};
