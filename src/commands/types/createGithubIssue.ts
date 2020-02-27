import ICommandType from '../ICommandType';
import { RichEmbed } from 'discord.js';
import { IIssue } from '../../models/github';
import axios, { AxiosResponse } from 'axios';

interface IIssueType {
    name: string;
    titlePrefix: string;
    label: string;
}
function getIssueType(issueTypeName: string): IIssueType {
    switch (issueTypeName) {
        case 'bug':
            return {
                name: issueTypeName,
                titlePrefix: '[Bug]',
                label: 'bug',
            };
        case 'feature':
            return {
                name: issueTypeName,
                titlePrefix: '[Feature Request]',
                label: 'Feature Request',
            };
        case 'support':
            return {
                name: issueTypeName,
                titlePrefix: '[Support]',
                label: 'Support',
            };
        default:
            return null;
    }
}

function buildIssueEmbed(issue: IIssue, firebotAuthor = false): RichEmbed {
    const embed = new RichEmbed().setColor(0x00a4cf);

    if (!firebotAuthor) {
        embed.setAuthor(issue.user.login, issue.user.avatar_url, `https://github.com/${issue.user.login}`);
    } else {
        embed.setAuthor(
            'Firebot',
            'https://raw.githubusercontent.com/crowbartools/Firebot/master/gui/images/logo_transparent.png',
            'https://github.com/crowbartools/Firebot/'
        );
    }

    embed.setTitle(issue.title);
    embed.setDescription(issue.body);
    embed.setURL(issue.html_url);

    return embed;
}

const command: ICommandType = {
    trigger: '!createissue',
    description: "Creates an issue on Firebot's GitHub repo.",
    deleteTrigger: true,
    ignoreCase: true,
    async execute(message, userCommand) {
        const args = userCommand.args;

        if (args.length === 1 && (args[0] === '?' || args[0].toLowerCase() === 'help')) {
            const embed = new RichEmbed()
                .setColor(0x00a4cf)
                .setAuthor(
                    'Create Issue Help',
                    'https://raw.githubusercontent.com/crowbartools/Firebot/master/gui/images/logo_transparent.png',
                    'https://github.com/crowbartools/Firebot/'
                );
            embed.addField('Exampe 1 *(Title only)*:', '!createissue [type] [title]');
            embed.addField('Exampe 2 *(Title & Description)*:', '!createissue [type] t:[title] d:[description]');
            embed.addField('*Issue Types*:', 'bug, feature, support');
            message.channel.send(embed);
            return;
        } else if (args.length < 2) {
            message.channel.send('Not enough arguments. Use **!createissue help** for help.');
            return;
        }

        const issueType = getIssueType(args[0].toLowerCase());

        if (issueType == null) {
            message.channel.send('Invalid issue type. Use **!createissue help** for help.');
            return;
        }

        args.shift();

        const titleRegex = /t:|title:/i;
        const descriptionRegex = /d:|description:/i;
        const hasTitleMarker = args.some(a => a.search(titleRegex) > -1);

        let title = '';
        let description = '';
        if (!hasTitleMarker) {
            const combinedArgs = args.join(' ');
            title = combinedArgs;
            description = combinedArgs;
        } else {
            let inTitle = false;
            let inDescription = false;
            for (let arg of args) {
                if (arg.search(titleRegex) > -1) {
                    inTitle = true;
                    inDescription = false;
                    arg = arg.replace(titleRegex, '');
                } else if (arg.search(descriptionRegex) > -1) {
                    inTitle = false;
                    inDescription = true;
                    arg = arg.replace(descriptionRegex, '');
                }
                if (inTitle) {
                    title += arg;
                } else if (inDescription) {
                    description += arg;
                }
            }
        }

        if (title.length < 10) {
            message.channel.send('Title must be at least 10 characters long. Use **!createissue help** for help.');
            return;
        }

        title = `${issueType.titlePrefix} ${title}`;
        description = `${description}\n\nCreated by @${message.author.username} via Discord`;

        let response: AxiosResponse<IIssue>;
        try {
            response = await axios.post(
                'https://api.github.com/repos/crowbartools/Firebot/issues',
                {
                    title: title,
                    body: description,
                    labels: [issueType.label],
                },
                {
                    auth: {
                        username: process.env.GITHUB_USER,
                        password: process.env.GITHUB_TOKEN,
                    },
                }
            );
        } catch (error) {
            console.log(error);
            message.channel.send('Unable to create issue at this time. Please try again later.');
            return;
        }

        if (response.status !== 201) {
            message.channel.send('Failed to create issue at this time. Please try again later.');
            return;
        }

        message.channel.send('Issue created!', buildIssueEmbed(response.data, true));
    },
};

export default command;
