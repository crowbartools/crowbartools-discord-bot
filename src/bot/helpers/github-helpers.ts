import { RichEmbed, Message } from 'discord.js';
import { IIssue } from '../models/github';
import { DiscordChannels } from './crowbar-helpers';

export interface IProject {
    name: string;
    repo: string;
}

export enum ProjectName {
    Firebot = 'firebot',
    Elixr = 'elixr',
}

export function getProject(projectName: string): IProject {
    switch (projectName) {
        case ProjectName.Firebot:
            return {
                name: projectName,
                repo: 'crowbartools/Firebot',
            };
        case ProjectName.Elixr:
            return {
                name: projectName,
                repo: 'crowbartools/MixrElixr',
            };
        default:
            return null;
    }
}

const firebotChannelIds = [
    DiscordChannels.FirebotFeedback,
    DiscordChannels.FirebotHelp,
    DiscordChannels.FirebotScripts,
    DiscordChannels.FirebotAlphaTesters,
    DiscordChannels.FirebotDev,
    DiscordChannels.FirebotGit,
];
const elixrChannelIds = [
    DiscordChannels.ElixrFeedback,
    DiscordChannels.ElixrHelp,
    DiscordChannels.ElixrDev,
    DiscordChannels.ElixrEmoteSubmissions,
    DiscordChannels.ElixrGit,
];
export function getDefaultProjectName(message: Message): string {
    let projectName: string;
    if (firebotChannelIds.includes(message.channel.id)) {
        projectName = ProjectName.Firebot;
    } else if (elixrChannelIds.includes(message.channel.id)) {
        projectName = ProjectName.Elixr;
    }
    return projectName || ProjectName.Firebot;
}

export const issueCreateHelpEmbed = new RichEmbed()
    .setColor(0x00a4cf)
    .setAuthor('Create Issue Help', 'https://crowbartools.com/user-content/emotes/global/crowbar.png')
    .addField('Exampe 1 *(Title only)*:', '!createissue [type] [title]')
    .addField('Exampe 2 *(Title & Description)*:', '!createissue [type] t:[title] d:[description]')
    .addField(
        'Exampe 3 *(Title & Description & Project)*:',
        '!createissue [type] t:[title] d:[description] p:[project]'
    )
    .addField('*Issue Types*:', 'bug, feature, support', true)
    .addField('*Projects*:', 'firebot, elixr', true)
    .addField(
        '\u200B',
        "*Note*: When left out, the project is automatically inferred as 'elixr' in elixr related channels and 'firebot' in every other channel."
    );

export const issueHelpEmbed = new RichEmbed()
    .setColor(0x00a4cf)
    .setAuthor('Issue Help', 'https://crowbartools.com/user-content/emotes/global/crowbar.png')
    .addField('Search for an open issue:', '!issue search [query]')
    .addField('Search issue for specified project:', '!issue search [project] [query]')
    .addField('Lookup specfic issue:', '!issue [issue#]')
    .addField('Lookup issue for specified project:', '!issue [project] [issue#]')
    .addField('Create an issue:', '!createissue help')
    .addField('*Projects*:', 'firebot, elixr')
    .addField(
        '\u200B',
        "*Note*: When left out, the project is automatically inferred as 'elixr' in elixr related channels and 'firebot' in every other channel."
    );

export const creatingIssuePlaceholderEmbed = new RichEmbed()
    .setColor(8947848)
    .setDescription('Attempting to create a new issue...');

export function buildIssueCreateFailedEmbed(text: string): RichEmbed {
    return new RichEmbed().setColor(16729927).setDescription(text);
}

export function buildIssueEmbed(issue: IIssue, projectName = 'firebot', showState = false): RichEmbed {
    const embed = new RichEmbed().setColor(0x00a4cf);

    if (projectName === 'elixr') {
        embed.setAuthor(
            'MixrElixr',
            'https://raw.githubusercontent.com/crowbartools/MixrElixr/dev/src/resources/images/elixr-light-128.png',
            'https://github.com/crowbartools/MixrElixr/'
        );
    } else {
        embed.setAuthor(
            'Firebot',
            'https://raw.githubusercontent.com/crowbartools/Firebot/master/gui/images/logo_transparent.png',
            'https://github.com/crowbartools/Firebot/'
        );
    }

    // set footer if user isnt crowbartools robot
    if (issue.user.login !== 'CrowbarToolsRobot') {
        embed.setFooter(issue.user.login, issue.user.avatar_url);
    }

    embed.setTimestamp(new Date(issue.created_at));

    let title = `Issue #${issue.number}: ${issue.title}`;
    if (title.length > 256) {
        title = title.substring(0, 255);
    }
    let body = issue.body;
    if (body.length > 350) {
        body = body.substring(0, 350).trim() + '...';
    }
    embed.setTitle(title);
    embed.setDescription(body);

    embed.setURL(issue.html_url);

    if (showState) {
        embed.addField('status', issue.state);
    }

    return embed;
}
