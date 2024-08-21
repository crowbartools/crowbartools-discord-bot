import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { getRandomFeaturedStream } from '../../../services/firebot.service';

const config = new SlashCommandBuilder()
    .setName('randomfeatured')
    .setDescription('Get a random Firebot featured stream');

export const randomFeaturedSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const randomFeaturedStream = await getRandomFeaturedStream();

        if (!randomFeaturedStream) {
            await interaction.followUp({
                content: "Couldn't get a random featured stream :(",
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(randomFeaturedStream.stream.title)
            .setURL(`https://twitch.tv/${randomFeaturedStream.login}`)
            .setColor('#6441a5')
            .setAuthor({
                name: randomFeaturedStream.displayName,
                iconURL: randomFeaturedStream.profileImageUrl,
            })
            .setTimestamp(new Date(randomFeaturedStream.stream.startedAt))
            .setImage(
                randomFeaturedStream.stream.thumbnailUrl
                    .replace('{width}', '1920')
                    .replace('{height}', '1080')
            )
            .setFields([
                {
                    name: 'Category',
                    value: randomFeaturedStream.stream.gameName,
                    inline: true,
                },
                {
                    name: 'Mature',
                    value: randomFeaturedStream.stream.isMature ? 'Yes' : 'No',
                    inline: true,
                },
            ])
            .setFooter({
                text: 'Live',
            });

        await interaction.followUp({
            content: `Random featured live stream:`,
            embeds: [embed],
        });
    },
};
