import { ICommandType } from '../../models/command';
import {
    getDefaultProjectName,
    getProject,
    buildIssueEmbed,
    buildIssueCreateFailedEmbed,
    issueCreateHelpEmbed,
    creatingIssuePlaceholderEmbed,
} from '../../helpers/github-helpers';
import { searchIssues, createIssue } from '../../services/github-service';
import NodeCache from 'node-cache';
import { Message } from 'discord.js';

const cooldownCache = new NodeCache({ stdTTL: 15, checkperiod: 15 });

//#region helpers
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
//#endregion

const command: ICommandType = {
    triggers: ['!createissue', '!ci'],
    description: "Creates an issue on Firebot's GitHub repo.",
    deleteTrigger: false,
    async execute(message, userCommand) {
        const args = userCommand.args;

        if (args.length === 1 && (args[0] === '?' || args[0].toLowerCase() === 'help')) {
            message.channel.send(issueCreateHelpEmbed);
            return;
        } else if (args.length < 2) {
            message.channel.send('Not enough arguments. Use **!createissue help** for help.');
            return;
        }

        if (cooldownCache.get(message.author.username)) {
            message.channel.send(
                `@${message.author.username} you have used the Create Issue command recently, please wait a few moments.`
            );
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
                        title += arg + ' ';
                        break;
                    case CommandFlag.Description:
                        description += arg + ' ';
                        break;
                    case CommandFlag.Project:
                        projectName += arg + ' ';
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

        title = `${issueType.titlePrefix} ${title.trim()}`;
        description = `${description.trim()}\n\nCreated by @${message.author.username} via Discord`;

        //add user to cooldown cache
        cooldownCache.set(message.author.username, true);

        const placeholderEmbedMessage = (await message.channel.send(creatingIssuePlaceholderEmbed)) as Message;
        if (!placeholderEmbedMessage.edit) {
            console.log('Placeholder embed failed!', placeholderEmbedMessage);
            message.channel.send('There was an error creating the issue. Please try again.');
        }

        const matchingIssues = await searchIssues(project.repo, title);

        if (matchingIssues != null && matchingIssues.length > 0) {
            placeholderEmbedMessage.edit(buildIssueCreateFailedEmbed('An issue with this name already exists!'));
            return;
        }

        const newIssue = await createIssue({
            repo: project.repo,
            title: title,
            body: description,
            labels: [issueType.label],
        });

        if (newIssue == null) {
            placeholderEmbedMessage.edit(
                buildIssueCreateFailedEmbed('Failed to create issue at this time. Please try again later.')
            );
            return;
        }

        if (message.deletable) {
            message.delete(0);
        }

        placeholderEmbedMessage.edit(buildIssueEmbed(newIssue, project.name));
    },
};

export default command;
