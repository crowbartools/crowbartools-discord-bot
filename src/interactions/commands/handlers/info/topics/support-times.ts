import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const supportTimes: InfoTopic = {
    name: 'Support Times',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Support Times').setDescription(`
Firebot is free, open source software that is created, maintained, and supported by a group consisting entirely of unpaid volunteers. While we understand waiting for answers can be frustrating, we have other responsibilities that come first, so we appreciate your patience. Someone will review your issue or question as soon as they are able.
`),
        ],
    },
};
