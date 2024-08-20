import { SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import {
    buildIssueModal,
    IssueModalType,
} from '../../../helpers/issue-modal-factory';

const config = new SlashCommandBuilder()
    .setName('submitfeature')
    .setDescription('Submit a feature request')
    .addStringOption((builder) =>
        builder
            .setName('title')
            .setDescription('A brief title for the feature request')
            .setMinLength(5)
            .setMaxLength(100)
            .setRequired(false)
    )
    .addStringOption((builder) =>
        builder
            .setName('description')
            .setDescription('The detailed description of the feature')
            .setMinLength(5)
            .setMaxLength(2000)
            .setRequired(false)
    );

export const submitFeatureSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        const issueTitle = interaction.options.getString('title');
        const issueDescription = interaction.options.getString('description');

        const issueModal = await buildIssueModal({
            type: IssueModalType.SubmitFeature,
            issueTitle,
            issueDescription,
        });

        await interaction.showModal(issueModal);
    },
};
