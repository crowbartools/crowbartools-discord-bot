import { RichEmbed } from 'discord.js';
import { ICommandType } from '../../models/command';
import { issueHelpEmbed, getDefaultProjectName, getProject } from '../../helpers/github-helpers';
import { getIssue, searchIssues } from '../../services/github-service';
import { limitString } from '../../../common/util';

const command: ICommandType = {
    triggers: ['!issue', '!i'],
    description: 'Look up a github issue or search issues.',
    deleteTrigger: true,
    async execute(message, userCommand) {
        const args = userCommand.args;
        if (args.length === 0 || (args.length === 1 && (args[0].toLowerCase() === 'help' || args[0] === '?'))) {
            message.channel.send(issueHelpEmbed);
            return;
        }

        if (args[0].toLowerCase() === 'search') {
            if (args.length === 1) {
                message.channel.send('Please provide a search query.');
                return;
            }
            args.shift();

            let projectName = getDefaultProjectName(message);
            if (['firebot', 'elixr'].includes(args[0].toLowerCase())) {
                projectName = args[0].toLowerCase();
                args.shift();
            }
            const project = getProject(projectName);

            const searchText = args.join(' ');
            if (searchText.length < 1) {
                message.channel.send('No search text provided.');
                return;
            }

            const issues = await searchIssues(project.repo, searchText);

            if (issues == null) {
                message.channel.send('Failed to search issues.');
                return;
            }

            const issueFields = issues.slice(0, 5).map(i => {
                return {
                    name: `#${i.number}`,
                    value: limitString(i.title, 250, '...'),
                };
            });

            const embed = new RichEmbed().setColor(0x00a4cf).setAuthor('Issue Search');

            for (const issueField of issueFields) {
                embed.addField(issueField.name, issueField.value);
            }
        }

        if (args.length === 1 && !isNaN(parseInt(args[0]))) {
        }
    },
};

export default command;
