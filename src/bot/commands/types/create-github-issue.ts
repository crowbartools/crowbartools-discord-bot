import { ICommandType } from '../../models/command';
import { RichEmbed } from 'discord.js';
import { IIssue } from '../../models/github';
import { getDefaultProjectName, getProject, buildIssueEmbed } from '../../helpers/github-helpers';
import axios, { AxiosResponse } from 'axios';

enum CommandFlag {
    Title,
    Description,
    Project,
}
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
                label: 'feature request',
            };
        case 'support':
            return {
                name: issueTypeName,
                titlePrefix: '[Support]',
                label: 'support',
            };
        default:
            return null;
    }
}

const command: ICommandType = {
    triggers: ['!createissue', '!ci'],
    description: "Creates an issue on Firebot's GitHub repo.",
    deleteTrigger: true,
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
        const hasTitleMarker = args.some(a => a.search(titleRegex) > -1);

        let title = '';
        let description = '';
        let projectName = getDefaultProjectName(message);
        if (!hasTitleMarker) {
            const combinedArgs = args.join(' ');
            title = combinedArgs;
            description = combinedArgs;
        } else {
            let currentFlag: CommandFlag;
            const flagTypes = [
                {
                    regex: titleRegex,
                    flag: CommandFlag.Title,
                },
                {
                    regex: /d:|description:/i,
                    flag: CommandFlag.Description,
                },
                {
                    regex: /p:|project:/i,
                    flag: CommandFlag.Project,
                },
            ];
            for (let arg of args) {
                //detect if we are in a new flag
                for (const flagType of flagTypes) {
                    if (arg.search(flagType.regex) > -1) {
                        currentFlag = flagType.flag;
                        arg = arg.replace(flagType.regex, '');
                        break;
                    }
                }

                switch (currentFlag) {
                    case CommandFlag.Title:
                        title += arg;
                        break;
                    case CommandFlag.Description:
                        description += arg;
                        break;
                    case CommandFlag.Project:
                        projectName += arg;
                }
            }
        }

        projectName = projectName.trim().toLowerCase();
        const project = getProject(projectName);
        if (project === null) {
            message.channel.send(`${projectName} is not a valid project name. Use **!createissue help** for help.`);
            return;
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
                `https://api.github.com/repos/${project.repo}/issues`,
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
