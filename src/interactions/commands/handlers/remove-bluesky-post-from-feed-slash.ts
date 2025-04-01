import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { removePostFromFeed } from '../../../services/firebot-atproto-feed.service';

const config = new SlashCommandBuilder()
    .setName('removefromfeed')
    .setDescription('Remove a post from the Firebot Bluesky feed')
    .addStringOption((option) =>
        option
            .setName('posturl')
            .setDescription('The url of the post to remove from the feed')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(0);

export const removeBlueskyPostFromFeedSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const postUrl = interaction.options.getString('posturl', true);

        const { success, errorMessage } = await removePostFromFeed(postUrl);

        if (success) {
            await interaction.followUp({
                content: `Successfully removed post from Firebot Bluesky feed!`,
            });
        } else {
            await interaction.followUp({
                content: `Could not remove post from feed: ${errorMessage ?? 'Unknown error'}`,
            });
        }
    },
};
