import { RichEmbed } from 'discord.js';
import { ICommandType } from '../../models/command';
import { issueHelpEmbed, buildIssueEmbed, getDefaultProjectName, getProject } from '../../helpers/github-helpers';
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
                    value: limitString(i.title, 500, '...'),
                    url: i.html_url,
                };
            });

            const embed = new RichEmbed().setColor(0x00a4cf).setTitle('Issue Search');

            if (project.name === 'elixr') {
                embed.setAuthor(
                    'MixrElixr',
                    'https://raw.githubusercontent.com/crowbartools/MixrElixr/dev/src/resources/images/elixr-light-128.png',
                    'https://github.com/crowbartools/MixrElixr/'
                );
            } else {
                embed.setAuthor(
                    'Firebot',
                    'https://raw.githubusercontent.com/crowbartools/Firebot/master/gui/images/logo_transparent.png',
                    'https://github.com/crowbartools/Firebot/'
                );
            }

            for (const issueField of issueFields) {
                const issueLink = `[${issueField.value}](${issueField.url})`;
                embed.addField(issueField.name, issueLink);
            }

            message.channel.send(embed);
            return;
        }

        // assume single issue lookup

        let projectName = getDefaultProjectName(message);
        if (['firebot', 'elixr'].includes(args[0].toLowerCase())) {
            projectName = args[0].toLowerCase();
            args.shift();
        }
        const project = getProject(projectName);

        const issueNumber = parseInt(args[0]);
        if (args.length > 0 && !isNaN(issueNumber)) {
            const issue = await getIssue(project.repo, issueNumber);
            if (issue == null) {
                message.channel.send(`Issue #${issueNumber} does not exist.`);
                return;
            }
            message.channel.send(buildIssueEmbed(issue, project.name, true));
        } else {
            message.channel.send('Not a valid Issue command. Use **!issue help** for help.');
        }
    },
};

export default command;
