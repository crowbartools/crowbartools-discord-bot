import { EmbedBuilder } from 'discord.js';
import { IIssue, ICommitData } from '../types/github';
import { limitString } from '../util/strings';
import { DateTime } from 'luxon';

const firebotLogoUrl =
    'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png';
const firebotRepoUrl = 'https://github.com/crowbartools/Firebot/';

export function buildIssueSearchEmbed(issues: IIssue[]): EmbedBuilder {
    const issueFields = issues.slice(0, 5).map((i) => {
        return {
            name: `#${i.number}`,
            value: limitString(i.title, 250, '...'),
            url: i.html_url,
        };
    });

    const embed = new EmbedBuilder()
        .setColor(0x00a4cf)
        .setTitle('Issue Search');

    embed.setAuthor({
        name: 'Firebot',
        iconURL: firebotLogoUrl,
        url: firebotRepoUrl,
    });

    embed.addFields(
        issueFields.map((i) => ({
            name: i.name,
            value: `[${i.value}](${i.url})`,
        }))
    );

    return embed;
}

export const creatingIssuePlaceholderEmbed = new EmbedBuilder()
    .setColor(8947848)
    .setDescription('Attempting to create a new issue...');

export function buildIssueCreateFailedEmbed(text: string): EmbedBuilder {
    return new EmbedBuilder().setColor(16729927).setDescription(text);
}

export function buildIssueEmbed(
    issue: IIssue,
    showExpandedInfo = false
): EmbedBuilder {
    const embed = new EmbedBuilder().setColor(0x00a4cf);

    embed.setAuthor({
        name: 'Firebot',
        iconURL: firebotLogoUrl,
        url: firebotRepoUrl,
    });

    // set footer if user isnt crowbartools robot
    if (issue.user.login !== 'CrowbarToolsRobot') {
        embed.setFooter({
            text: issue.user.login,
            iconURL: issue.user.avatar_url,
        });
    }

    embed.setTimestamp(new Date(issue.created_at));

    let title = `Issue #${issue.number}: ${issue.title}`;
    if (title.length > 256) {
        title = title.substring(0, 255);
    }
    let body = issue.body;
    if (body.length > 3500) {
        body = body.substring(0, 3500).trim() + '...';
    }
    embed.setTitle(title);
    embed.setDescription(body);

    embed.setURL(issue.html_url);

    if (showExpandedInfo) {
        const labelNames =
            issue.labels && issue.labels.length > 0
                ? issue.labels.map((i) => i.name).join(', ')
                : 'none';

        embed.addFields([
            {
                name: 'status',
                value: issue.state,
                inline: true,
            },
            {
                name: 'labels',
                value: labelNames,
                inline: true,
            },
            {
                name: 'comments',
                value: issue.comments.toString(),
                inline: true,
            },
        ]);
    }

    return embed;
}

export function buildRecentCommitsEmbed(commits: ICommitData[]): EmbedBuilder {
    const commitMessages = commits.slice(0, 10).map((c) => {
        return {
            message: c.commit.message,
            name: c.author.login,
            date: DateTime.fromISO(c.commit.committer.date).toFormat(
                'h:mm A MM/DD/YYYY'
            ),
        };
    });

    const embed = new EmbedBuilder().setColor(0x00a4cf).setAuthor({
        name: 'Recent V5 Commits',
        iconURL: firebotLogoUrl,
        url: `${firebotRepoUrl}commits/v5`,
    });

    embed.setFields(
        commitMessages.map((cm) => ({
            name: cm.message,
            value: `*${cm.name}* (${cm.date})`,
        }))
    );

    return embed;
}
