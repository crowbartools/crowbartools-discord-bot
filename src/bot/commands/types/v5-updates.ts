import moment from 'moment';
import { ICommandType } from '../../models/command';
import { getRecentCommits } from '../../services/github-service';
import { buildRecentCommitsEmbed } from '../../helpers/github-helpers';

const command: ICommandType = {
    triggers: ['!v5updates'],
    description: 'List recent v5 commit messages.',
    deleteTrigger: false,
    async execute(message) {
        const sinceDate = moment()
            .subtract('month', 1)
            .format();

        const commits = await getRecentCommits({
            repo: 'crowbartools/Firebot',
            branch: 'v5',
            sinceDateString: sinceDate,
        });

        if (commits == null) {
            console.log('Failed to get recent v5 commit messages');
            return;
        }

        message.channel.send(buildRecentCommitsEmbed(commits));
    },
};
export default command;
