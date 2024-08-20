import { SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import {
    buildIssueModal,
    IssueModalType,
} from '../../../helpers/issue-modal-factory';

const config = new SlashCommandBuilder()
    .setName('submitbug')
    .setDescription('Submit a bug report')
    .addStringOption((builder) =>
        builder
            .setName('title')
            .setDescription('A brief title for the bug report')
            .setMinLength(5)
            .setMaxLength(100)
            .setRequired(false)
    )
    .addStringOption((builder) =>
        builder
            .setName('description')
            .setDescription('The detailed description of the bug')
            .setMinLength(5)
            .setMaxLength(2000)
            .setRequired(false)
    );

export const submitBugSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        const issueTitle = interaction.options.getString('title');
        const issueDescription = interaction.options.getString('description');

        const issueModal = await buildIssueModal({
            type: IssueModalType.SubmitBug,
            issueTitle,
            issueDescription,
        });

        await interaction.showModal(issueModal);
    },
};
