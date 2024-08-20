import { SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { getIssue, searchIssues } from '../../../services/github.service';
import { limitString } from '../../../util/strings';
import { buildIssueEmbed } from '../../../helpers/github-embed-factory';

const config = new SlashCommandBuilder()
    .setName('issue')
    .setDescription('Lookup an issue on GitHub')
    .addStringOption((option) =>
        option
            .setName('query')
            .setDescription('Search for an issue with issue title or number')
            .setRequired(true)
            .setAutocomplete(true)
    );

export const lookupIssueSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onAutocomplete(interaction) {
        try {
            const query = interaction.options.getString('query');
            const issues = await searchIssues('crowbartools/firebot', query);
            await interaction.respond(
                issues.map((i) => ({
                    name: limitString(`#${i.number}: ${i.title}`, 60, '...'),
                    value: i.number.toString(),
                }))
            );
        } catch {
            await interaction.respond([]);
        }
    },
    async onTrigger(interaction) {
        await interaction.deferReply();
        const query = interaction.options.getString('query');
        const issueNumber = parseInt(query);
        if (!isNaN(issueNumber)) {
            const issue = await getIssue('crowbartools/firebot', issueNumber);
            if (issue == null) {
                await interaction.editReply(
                    `Issue #${issueNumber} does not exist.`
                );
                return;
            }
            await interaction.editReply({
                embeds: [buildIssueEmbed(issue, true)],
            });
            return;
        } else {
            await interaction.editReply("Couldn't find an issue!");
        }
    },
};
