import { ICommandType } from '../../models/command';
import {
    issueHelpEmbed,
    buildIssueEmbed,
    buildIssueSearchEmbed,
    getDefaultProjectName,
    getProject,
} from '../../helpers/github-helpers';
import { getIssue, searchIssues } from '../../services/github-service';

const command: ICommandType = {
    triggers: ['!issue', '!i'],
    description: 'Look up a github issue or search issues.',
    deleteTrigger: false,
    async execute(message, userCommand) {
        const args = userCommand.args;

        // help command
        if (
            args.length === 0 ||
            (args.length === 1 &&
                (args[0].toLowerCase() === 'help' || args[0] === '?'))
        ) {
            message.channel.send({
                embeds: [issueHelpEmbed],
            });
            return;
        }

        // issue search
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

            message.channel.send({
                embeds: [buildIssueSearchEmbed(issues)],
            });
            return;
        }

        // single issue lookup

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
            message.channel.send({
                embeds: [buildIssueEmbed(issue, project.name, true)],
            });
            return;
        }

        // unrecongized command
        message.channel.send(
            'Not a valid Issue command. Use **!issue help** for help.'
        );
    },
};

export default command;
