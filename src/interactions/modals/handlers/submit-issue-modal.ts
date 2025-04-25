import { buildIssueEmbed } from '../../../helpers/github-embed-factory';
import { IssueModalType } from '../../../helpers/issue-modal-factory';
import { parseModalId } from '../../../helpers/modal-id-parser';
import { createIssue, searchIssues } from '../../../services/github.service';
import { IssueType } from '../../../types/github';
import { capitalize } from '../../../util/strings';
import { IModalHandler } from '../modal-handler.interface';

const FIREBOT_REPO = 'crowbartools/firebot';

export const submitIssueModalHandler: IModalHandler = {
    handleModalIds: [IssueModalType.SubmitFeature, IssueModalType.SubmitBug],
    async onModalSubmit(interaction, modalData: string) {
        await interaction.deferReply();

        const { id } = parseModalId(interaction.customId);
        const issueModalType = id as IssueModalType;

        const issueConfig = getIssueTypeConfig(issueModalType);

        if (issueConfig == null) {
            throw new Error(`Invalid issue modal type: ${issueModalType}`);
        }

        const titleValue = interaction.fields.getTextInputValue('title');
        const descriptionValue =
            interaction.fields.getTextInputValue('description');

        const issueDetails = {
            title: capitalize(titleValue.trim(), false),
            description: descriptionValue,
        };

        const descriptionFields: [header: string, content: string][] = [
            ['Description', issueDetails.description.trim()],
        ];
        if (issueModalType === IssueModalType.SubmitBug) {
            const extraFields: [id: string, label: string][] = [
                ['reproSteps', 'Steps to Reproduce'],
                ['expectedBehavior', 'Expected Behavior'],
                ['firebotVersion', 'Firebot Version'],
            ];

            for (const [id, label] of extraFields) {
                const value = interaction.fields.getTextInputValue(id);
                if (value) {
                    descriptionFields.push([label, value.trim()]);
                }
            }
        }
        descriptionFields.push(['Submitted By', interaction.user.username]);

        issueDetails.description = descriptionFields
            .map(([header, content]) => `### ${header}\n${content}`)
            .join('\n');

        if (modalData) {
            const [guildId, channelId, messageId] = modalData.split(',');
            if (guildId && channelId && messageId) {
                const url = `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
                issueDetails.description += `\n\n> Created via Discord from a [message](${url}).`;
            }
        } else {
            issueDetails.description += `\n\n> Created via Discord.`;
        }

        const matchingIssues = await searchIssues(
            FIREBOT_REPO,
            issueDetails.title
        );

        if (matchingIssues != null && matchingIssues.length > 0) {
            interaction.followUp(
                `A [${issueConfig.name} with this name](${matchingIssues[0].html_url}) already exists!`
            );
            return;
        }

        const newIssue = await createIssue({
            repo: FIREBOT_REPO,
            title: issueDetails.title,
            body: issueDetails.description,
            type: issueConfig.type,
        });

        if (newIssue == null) {
            interaction.followUp(
                `Failed to create ${issueConfig.name} at this time. Please try again later.`
            );
            return;
        }

        const issueEmbed = buildIssueEmbed(newIssue);

        await interaction.followUp({
            embeds: [issueEmbed],
        });

        try {
            await interaction.user.send({
                content: `Your ${issueConfig.longName} was successfully submitted! Here's a copy so you can easily find it later to track progress.`,
                embeds: [issueEmbed],
            });
        } catch {
            console.error(`Failed to DM ticket to user ${interaction.user.globalName}`);

            try {
                await interaction.followUp({
                    content: `Your ${issueConfig.longName} was successfully submitted, but I failed to DM it to you. Use the ticket number link above to track progress.`,
                    ephemeral: true
                });
            } catch (error) {
                console.error(error);
            }
        }
    },
};

function getIssueTypeConfig(issueType: IssueModalType): {
    name: string;
    longName: string;
    type: IssueType;
} {
    if (issueType === IssueModalType.SubmitFeature) {
        return {
            name: 'feature',
            longName: 'feature request',
            type: 'Feature',
        };
    }

    if (issueType === IssueModalType.SubmitBug) {
        return {
            name: 'bug',
            longName: 'bug report',
            type: 'Bug',
        };
    }

    return null;
}
