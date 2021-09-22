import { ICommandType } from '../../models/command';
import { capitalize, limitString } from '../../../common/util';
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
import { Message } from 'discord.js';
import { ApplicationOptions } from 'discord-slash-commands-client';

const cooldownCache = new NodeCache({ stdTTL: 15, checkperiod: 15 });

const DEV_ROLE_ID = '372819709604921355';

enum CreateGithubIssueCommand {
    CreateIssue = 'createissue',
    CreateFeatureRequest = 'Create Feature',
    CreateBug = 'Create Bug',
}

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
            message.channel.send({
                embeds: [issueCreateHelpEmbed],
            });
            return;
        } else if (args.length < 2) {
            message.channel.send(
                'Not enough arguments. Use **!createissue help** for help.'
            );
            return;
        }

        if (cooldownCache.get(message.author.username)) {
            message.channel.send(
                `${message.author.username} you have used the Create Issue command recently, please wait a few moments.`
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

        const placeholderEmbedMessage = (await message.channel.send({
            embeds: [creatingIssuePlaceholderEmbed],
        })) as Message;
        if (!placeholderEmbedMessage.edit) {
            console.log('Placeholder embed failed!', placeholderEmbedMessage);
            message.channel.send(
                'There was an error creating the issue. Please try again.'
            );
        }

        const matchingIssues = await searchIssues(project.repo, title);

        if (matchingIssues != null && matchingIssues.length > 0) {
            placeholderEmbedMessage.edit({
                embeds: [
                    buildIssueCreateFailedEmbed(
                        'An issue with this name already exists!'
                    ),
                ],
            });
            return;
        }

        const newIssue = await createIssue({
            repo: project.repo,
            title: title,
            body: description,
            labels: [issueType.label],
        });

        if (newIssue == null) {
            placeholderEmbedMessage.edit({
                embeds: [
                    buildIssueCreateFailedEmbed(
                        'Failed to create issue at this time. Please try again later.'
                    ),
                ],
            });
            return;
        }

        if (message.deletable) {
            message.delete();
        }

        placeholderEmbedMessage.edit({
            embeds: [buildIssueEmbed(newIssue, project.name)],
        });
    },
    applicationCommands: [
        {
            config: {
                name: CreateGithubIssueCommand.CreateIssue,
                type: 1,
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
                                description:
                                    'Give a brief title for the feature',
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
        },
        {
            config: {
                name: CreateGithubIssueCommand.CreateFeatureRequest,
                type: 3,
                // eslint-disable-next-line @typescript-eslint/camelcase
                default_permission: false,
            } as ApplicationOptions,
            permissions: [
                {
                    type: 1,
                    id: DEV_ROLE_ID, // Dev Role Id
                    permission: true,
                },
            ],
        },
        {
            config: {
                name: CreateGithubIssueCommand.CreateBug,
                type: 3,
                // eslint-disable-next-line @typescript-eslint/camelcase
                default_permission: false,
            } as ApplicationOptions,
            permissions: [
                {
                    type: 1,
                    id: DEV_ROLE_ID, // Dev Role Id
                    permission: true,
                },
            ],
        },
    ],
    async handleInteraction(interaction) {
        if (!(interaction.isCommand() || interaction.isContextMenu())) {
            return;
        }

        let issueType: IIssueType;
        let title: string;
        let description: string;

        if (interaction.isContextMenu()) {
            await interaction.deferReply();

            issueType = getIssueType(
                interaction.commandName === CreateGithubIssueCommand.CreateBug
                    ? 'bug'
                    : 'feature'
            );

            const message = interaction.options.getMessage('message');

            title = limitString(message.content, 50, '...');

            description = `**Original Discord message by ${message.author.username}:**
            ${message.content}

            > Issue created by ${interaction.user.username} via Discord`;
        } else if (interaction.isCommand()) {
            await interaction.deferReply();

            issueType = getIssueType(interaction.options.getSubcommand());
            title = interaction.options.getString('title');
            description = interaction.options.getString('description');

            if (title.length < 5) {
                interaction.editReply(
                    'Issue title must be at least 5 characters long.'
                );
                return;
            }

            if (description == null) {
                description = title;
            }

            description = `${
                interaction.user.username
            } via Discord:\n\n${capitalize(description.trim(), false)}`;
        }

        title = `${issueType.titlePrefix} ${capitalize(title.trim(), false)}`;

        const project = getProject(ProjectName.Firebot);

        const matchingIssues = await searchIssues(project.repo, title);

        if (matchingIssues != null && matchingIssues.length > 0) {
            interaction.editReply('An issue with this name already exists!');
            return;
        }

        const newIssue = await createIssue({
            repo: project.repo,
            title: title,
            body: description,
            labels: [issueType.label],
        });

        if (newIssue == null) {
            interaction.editReply(
                'Failed to create issue at this time. Please try again later.'
            );
            return;
        }

        interaction.editReply({
            embeds: [buildIssueEmbed(newIssue, project.name)],
        });
    },
};

export default command;
