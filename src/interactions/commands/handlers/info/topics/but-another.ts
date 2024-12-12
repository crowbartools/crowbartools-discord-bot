import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const butAnother: InfoTopic = {
    name: 'But Another Bot Does It',
    message: {
        embeds: [
            getBaseEmbed().setTitle('But Another Bot Does It?').setDescription(`
Just a friendly reminder, just because Software A supports something, that doesn't mean that Software B is required to support it.
Things you want won't always appear in the software you use.
This is true in all walks of computer life and why there are so many tools that do the same thing.
`),
        ],
    },
};
