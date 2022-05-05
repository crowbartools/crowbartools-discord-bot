import { ICommandType } from '../../types/command';
import {
    //issueHelpEmbed,
    buildIssueEmbed,
    //buildIssueSearchEmbed,
    //getDefaultProjectName,
    getProject,
} from '../../helpers/github-helpers';
import { getIssue, searchIssues } from '../../services/github-service';
import { SlashCommandBuilder } from '@discordjs/builders';
import { limitString } from '../../../common/util';

const config = new SlashCommandBuilder()
    .setName('issue')
    .setDescription('Lookup an issue on GitHub')
    .addStringOption(option =>
        option
            .setName('search')
            .setDescription('Search for an issue with issue number or title')
            .setRequired(true)
            // Enable autocomplete using the `setAutocomplete` method
            .setAutocomplete(true)
    )
    .toJSON();

const command: ICommandType = {
    applicationCommands: [
        {
            config: config as any,
        },
    ],
    async handleInteraction(interaction) {
        if (interaction.isAutocomplete()) {
            const search = interaction.options.getString('search');
            const issues = await searchIssues('crowbartools/Firebot', search);
            await interaction.respond(
                issues.map(i => ({
                    name: limitString(`#${i.number}: ${i.title}`, 60, '...'),
                    value: i.number.toString(),
                }))
            );
            return;
        } else if (interaction.isCommand()) {
            await interaction.deferReply();
            const search = interaction.options.getString('search');
            const project = getProject('firebot');
            const issueNumber = parseInt(search);
            if (!isNaN(issueNumber)) {
                const issue = await getIssue(project.repo, issueNumber);
                if (issue == null) {
                    await interaction.editReply(
                        `Issue #${issueNumber} does not exist.`
                    );
                    return;
                }
                await interaction.editReply({
                    embeds: [buildIssueEmbed(issue, project.name, true)],
                });
                return;
            } else {
                await interaction.editReply("Couldn't find an issue! :(");
            }
        }
    },
};

export default command;
