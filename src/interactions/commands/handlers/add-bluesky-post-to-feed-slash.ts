import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { addPostToFeed, removePostFromFeed } from '../../../services/firebot-atproto-feed.service';

const config = new SlashCommandBuilder()
    .setName('addtofeed')
    .setDescription('Add a post to the Firebot Bluesky feed')
    .addStringOption((option) =>
        option
            .setName('posturl')
            .setDescription('The url of the post to add to the feed')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(0);

export const addBlueskyPostToFeedSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const postUrl = interaction.options.getString('posturl', true);

        const { success, errorMessage } = await addPostToFeed(postUrl);

        if (success) {
            await interaction.followUp({
                content: `Successfully added post to Firebot Bluesky feed!`,
            });
        } else {
            await interaction.followUp({
                content: `Could not add post to feed: ${errorMessage ?? 'Unknown error'}`,
            });
        }
    },
};
