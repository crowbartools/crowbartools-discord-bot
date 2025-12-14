import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { getSupportedFirebotVersionField } from '../../../services/github.service';

const config = new SlashCommandBuilder()
    .setName('supportedversions')
    .setDescription('Get the currently supported Firebot versions');

export const supportedVersionsSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const supportedVersionsField = await getSupportedFirebotVersionField();

        if (!supportedVersionsField) {
            await interaction.followUp({
                content: "Couldn't get the supported Firebot versions :(",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#FFBE00')
            .setFields(supportedVersionsField);

        await interaction.followUp({
            embeds: [embed],
            ephemeral: true,
        });
    },
};
