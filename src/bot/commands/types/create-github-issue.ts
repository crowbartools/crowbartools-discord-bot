import { ICommandType } from '../../models/command';
import { capitalize, limitString } from '../../../common/util';
import {
    getProject,
    buildIssueEmbed,
    ProjectName,
} from '../../helpers/github-helpers';
import { searchIssues, createIssue } from '../../services/github-service';
import {
    Modal,
    ModalSubmitInteraction,
    TextInputComponent,
} from 'discord-modals';

enum CreateGithubIssueCommand {
    CreateFeatureSlashCmd = 'createfeature',
    CreateBugSlashCmd = 'createbug',
    CreateFeatureRequest = 'Create Feature',
    CreateBug = 'Create Bug',
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

async function handleCreateIssueModalSubmit(
    interaction: ModalSubmitInteraction,
    issueTypeName: string
): Promise<void> {
    await interaction.deferReply({});

    const issueType = getIssueType(issueTypeName);

    let title = interaction.getTextInputValue('title');
    let description = interaction.getTextInputValue('description');

    if (description?.length < 1) {
        description = title;
    }

    description = `${interaction.user.username} via Discord:\n\n${capitalize(
        description.trim(),
        false
    )}`;

    title = `${issueType.titlePrefix} ${capitalize(title.trim(), false)}`;

    const project = getProject(ProjectName.Firebot);

    const matchingIssues = await searchIssues(project.repo, title);

    if (matchingIssues != null && matchingIssues.length > 0) {
        interaction.followUp(
            `A ${issueTypeName} with this name already exists!`
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
        interaction.followUp(
            `Failed to create ${issueTypeName} at this time. Please try again later.`
        );
        return;
    }

    interaction.followUp({
        embeds: [buildIssueEmbed(newIssue, project.name)],
    });
}

const command: ICommandType = {
    applicationCommands: [
        {
            config: {
                type: 1,
                name: CreateGithubIssueCommand.CreateFeatureSlashCmd,
                description: 'Create a feature request',
            },
        },
        {
            config: {
                type: 1,
                name: CreateGithubIssueCommand.CreateBugSlashCmd,
                description: 'Create a bug report',
            },
        },
        {
            config: {
                type: 3,
                name: CreateGithubIssueCommand.CreateFeatureRequest,
            },
        },
        {
            config: {
                type: 3,
                name: CreateGithubIssueCommand.CreateBug,
            },
        },
    ],
    modalSubmitListeners: {
        createBug: async interaction => {
            handleCreateIssueModalSubmit(interaction, 'bug');
        },
        createFeature: async interaction => {
            handleCreateIssueModalSubmit(interaction, 'feature');
        },
    },
    async handleInteraction(interaction, _discordClient, interactionClient) {
        if (!(interaction.isCommand() || interaction.isContextMenu())) {
            return;
        }

        let modalType: string;
        let modalTitle: string;

        let title = '';
        let description = '';

        if (interaction.isContextMenu()) {
            modalType =
                interaction.commandName === CreateGithubIssueCommand.CreateBug
                    ? 'createBug'
                    : 'createFeature';

            modalTitle =
                interaction.commandName === CreateGithubIssueCommand.CreateBug
                    ? 'Create Bug Report'
                    : 'Create Feature Request';

            const message = interaction.options.getMessage('message');

            title = limitString(message.content, 97, '...');

            description = `**Original Discord message by ${message.author.username}:**\n${message.content}\n\n> Issue created by ${interaction.user.username} via Discord`;
        } else {
            modalType =
                interaction.commandName ===
                CreateGithubIssueCommand.CreateBugSlashCmd
                    ? 'createBug'
                    : 'createFeature';

            modalTitle =
                interaction.commandName ===
                CreateGithubIssueCommand.CreateBugSlashCmd
                    ? 'Create Bug Report'
                    : 'Create Feature Request';
        }

        const createModal = new Modal()
            .setCustomId(modalType)
            .setTitle(modalTitle)
            .addComponents(
                new TextInputComponent()
                    .setCustomId('title')
                    .setLabel('Title')
                    .setStyle('SHORT')
                    .setMinLength(5)
                    .setMaxLength(100)
                    .setPlaceholder('Enter title')
                    .setDefaultValue(title)
                    .setRequired(true),
                new TextInputComponent()
                    .setCustomId('description')
                    .setLabel('Description')
                    .setStyle('LONG')
                    .setMinLength(5)
                    .setMaxLength(2000)
                    .setDefaultValue(description)
                    .setPlaceholder('Enter description')
            );

        interactionClient.showModal(interaction, createModal.toJSON());
    },
};

export default command;
