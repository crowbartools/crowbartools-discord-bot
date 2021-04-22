import { ICommandType } from '../../models/command';
import { capitalize } from '../../../common/util';
import {
    getDefaultProjectName,
    getProject,
    buildIssueEmbed,
    buildIssueCreateFailedEmbed,
    issueCreateHelpEmbed,
    creatingIssuePlaceholderEmbed,
    ProjectName,
} from '../../helpers/github-helpers';
import { searchIssues, createIssue } from '../../services/github-service';
import NodeCache from 'node-cache';
import { Message, MessageEmbed } from 'discord.js';

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
                label: 'Bug',
            };
        case 'feature':
            return {
                name: issueTypeName,
                titlePrefix: '[Feature Request]',
                label: 'Enhancement',
            };
        case 'support':
            return {
                name: issueTypeName,
                titlePrefix: '[Support]',
                label: 'Support',
            };
        case 'dev':
        case 'debt':
        case 'td':
        case 'maintenance':
        case 'maint':
        case 'techdebt':
            return {
                name: issueTypeName,
                titlePrefix: '[Tech Debt]',
                label: 'Tech Debt',
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

        if (
            args.length === 1 &&
            (args[0] === '?' || args[0].toLowerCase() === 'help')
        ) {
            message.channel.send(issueCreateHelpEmbed);
            return;
        } else if (args.length < 2) {
            message.channel.send(
                'Not enough arguments. Use **!createissue help** for help.'
            );
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
            message.channel.send(
                'Invalid issue type. Use **!createissue help** for help.'
            );
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
            message.channel.send(
                `${projectName} is not a valid project name. Use **!createissue help** for help.`
            );
            return;
        }

        if (title.length < 10) {
            message.channel.send(
                'Title must be at least 10 characters long. Use **!createissue help** for help.'
            );
            return;
        }

        title = `${issueType.titlePrefix} ${capitalize(title.trim(), false)}`;
        description = description ? description.trim() : '';
        if (description.length > 0) {
            description = `@${
                message.author.username
            } via Discord:\n\n${capitalize(description.trim(), false)}`;
        }

        //add user to cooldown cache
        cooldownCache.set(message.author.username, true);

        const placeholderEmbedMessage = (await message.channel.send(
            creatingIssuePlaceholderEmbed
        )) as Message;
        if (!placeholderEmbedMessage.edit) {
            console.log('Placeholder embed failed!', placeholderEmbedMessage);
            message.channel.send(
                'There was an error creating the issue. Please try again.'
            );
        }

        const matchingIssues = await searchIssues(project.repo, title);

        if (matchingIssues != null && matchingIssues.length > 0) {
            placeholderEmbedMessage.edit(
                buildIssueCreateFailedEmbed(
                    'An issue with this name already exists!'
                )
            );
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
                buildIssueCreateFailedEmbed(
                    'Failed to create issue at this time. Please try again later.'
                )
            );
            return;
        }

        if (message.deletable) {
            message.delete();
        }

        placeholderEmbedMessage.edit(buildIssueEmbed(newIssue, project.name));
    },
    supportsSlashCommands: true,
    slashCommandConfig: {
        name: 'createissue',
        description:
            'Create firebot issues (bugs, feature requests, etc) from Discord!',
        options: [
            {
                name: 'feature',
                type: 1,
                description: 'Create a Feature Request',
                options: [
                    {
                        name: 'title',
                        description: 'Give a brief title for the feature',
                        type: 3,
                        required: true,
                    },
                    {
                        name: 'description',
                        description: 'Describe the feature',
                        type: 3,
                        required: false,
                    },
                ],
            },
            {
                name: 'bug',
                type: 1,
                description: 'Create a Bug Report',
                options: [
                    {
                        name: 'title',
                        description: 'Give a brief title for the bug',
                        type: 3,
                        required: true,
                    },
                    {
                        name: 'description',
                        description: 'Describe the bug',
                        type: 3,
                        required: false,
                    },
                ],
            },
            {
                name: 'support',
                type: 1,
                description: 'Create a support ticket',
                options: [
                    {
                        name: 'title',
                        description:
                            'Give a brief title for the reason you need help',
                        type: 3,
                        required: true,
                    },
                    {
                        name: 'description',
                        description: 'Describe your issue in detail',
                        type: 3,
                        required: false,
                    },
                ],
            },
        ],
    },
    async handleInteraction(interaction) {
        await interaction.thinking();

        const issueType = getIssueType(interaction.options[0].name);

        let title = interaction.options[0].options.find(o => o.name === 'title')
            .value;

        if (title.length < 10) {
            interaction.edit(
                'Issue title must be at least 10 characters long.'
            );
            return;
        }

        let description = interaction.options[0].options.find(
            o => o.name === 'description'
        )?.value;

        if (description == null) {
            description = title;
        }

        title = `${issueType.titlePrefix} ${capitalize(title.trim(), false)}`;

        description = `@${
            interaction.author.username
        } via Discord:\n\n${capitalize(description.trim(), false)}`;

        const project = getProject(ProjectName.Firebot);

        const matchingIssues = await searchIssues(project.repo, title);

        if (matchingIssues != null && matchingIssues.length > 0) {
            interaction.edit('An issue with this name already exists!');
            return;
        }

        const newIssue = await createIssue({
            repo: project.repo,
            title: title,
            body: description,
            labels: [issueType.label],
        });

        if (newIssue == null) {
            interaction.edit(
                'Failed to create issue at this time. Please try again later.'
            );
            return;
        }

        interaction.edit([buildIssueEmbed(newIssue, project.name)]);
    },
};

export default command;
