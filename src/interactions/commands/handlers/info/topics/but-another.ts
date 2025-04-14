import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const butAnother: InfoTopic = {
    name: 'But Another Bot Does It',
    message: {
        embeds: [
            getBaseEmbed().setTitle('But Another Bot Does It?').setDescription(`
Just a friendly reminder, just because Software A supports something, that doesn't mean that Software B is required to support it.
Things you want may not always appear in the software you use, or may take time from our open source community to contribute and build.
This is true in all walks of computer life and why there are so many tools that do similar things - if Firebot isn't able to do something today, there might be another tool out there that can be a stopgap if/until Firebot supports it.
`),
        ],
    },
};
