import moment from 'moment';
import { RichEmbed } from 'discord.js';
import { ICommandType } from '../../models/command';
import { getRecentCommits } from '../../services/github-service';

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

        const commitMessages = commits.slice(0, 10).map(c => {
            return {
                message: c.commit.message,
                name: c.author.login,
                date: moment(c.commit.committer.date).format('h:mm A MM/DD/YYYY'),
            };
        });

        const embed = new RichEmbed()
            .setColor(0x00a4cf)
            .setAuthor(
                'Recent V5 Commits',
                'https://raw.githubusercontent.com/crowbartools/Firebot/master/gui/images/logo_transparent.png',
                'https://github.com/crowbartools/Firebot/commits/v5'
            );

        for (const cm of commitMessages) {
            embed.addField(cm.message, `*${cm.name}* (${cm.date})`);
        }

        // Send the embed to the same channel as the message
        message.channel.send(embed);
    },
};

export default command;
