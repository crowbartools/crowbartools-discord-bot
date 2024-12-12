import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const discordMentions: InfoTopic = {
    name: 'Discord Mentions',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Discord Mentions').setDescription(`
With developer mode enabled in Discord, go to the Roles section in your Discord server settings, tap on the three-dot menu next to the role you want to mention, then Copy ID.
Then use \`<@&roleid>\` in the message (e.g. \`<@&9471923849123483>\`).
`),
        ],
    },
};
