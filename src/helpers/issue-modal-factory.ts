import {
    ActionRowBuilder,
    Message,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
import { getLatestFirebotReleaseVersion } from '../services/github.service';
import { createModalId } from './modal-id-parser';

export enum IssueModalType {
    SubmitFeature = 'sf',
    SubmitBug = 'sb',
}

type ModalDetails = {
    type: IssueModalType;
    issueTitle?: string;
    issueDescription?: string;
    originalMessage?: Message;
};

export async function buildIssueModal({
    type,
    issueTitle,
    issueDescription,
    originalMessage,
}: ModalDetails): Promise<ModalBuilder> {
    const components: TextInputBuilder[] = [];

    const titleInput = new TextInputBuilder()
        .setCustomId('title')
        .setStyle(TextInputStyle.Short)
        .setLabel('Title')
        .setPlaceholder('Enter title')
        .setMinLength(5)
        .setMaxLength(100)
        .setRequired(true);

    if (issueTitle?.length) {
        titleInput.setValue(issueTitle);
    }
    components.push(titleInput);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('description')
        .setStyle(TextInputStyle.Paragraph)
        .setLabel('Description')
        .setPlaceholder('Enter description')
        .setMinLength(5)
        .setMaxLength(2000)
        .setRequired(true);

    if (issueDescription?.length) {
        descriptionInput.setValue(issueDescription);
    }
    components.push(descriptionInput);

    if (type === IssueModalType.SubmitBug) {
        components.push(
            new TextInputBuilder()
                .setCustomId('reproSteps')
                .setStyle(TextInputStyle.Paragraph)
                .setLabel('Steps to Reproduce')
                .setPlaceholder('Enter steps to reproduce')
                .setValue('1.\n2.\n3.\n')
                .setMinLength(5)
                .setMaxLength(2000)
                .setRequired(false)
        );

        components.push(
            new TextInputBuilder()
                .setCustomId('expectedBehavior')
                .setStyle(TextInputStyle.Paragraph)
                .setLabel('Expected Behavior')
                .setPlaceholder('Enter what you expect to happen')
                .setMinLength(5)
                .setMaxLength(2000)
                .setRequired(false)
        );

        const versionInput = new TextInputBuilder()
            .setCustomId('firebotVersion')
            .setStyle(TextInputStyle.Short)
            .setLabel('Firebot Version')
            .setMinLength(4)
            .setPlaceholder('eg v5.62.0');

        const latestVersion = await getLatestFirebotReleaseVersion();
        if (latestVersion) {
            versionInput.setValue(latestVersion);
        }

        components.push(versionInput);
    }

    const actionRows = components.map((component) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            component
        )
    );

    const data = originalMessage
        ? `${originalMessage.guildId},${originalMessage.channelId},${originalMessage.id}`
        : undefined;

    return new ModalBuilder()
        .setCustomId(createModalId(type, data))
        .setTitle(
            type === IssueModalType.SubmitBug
                ? 'Submit Bug'
                : 'Submit Feature Request'
        )
        .addComponents(actionRows);
}
