import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const bitDefender: InfoTopic = {
    name: 'Bit Defender',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Bit Defender').setDescription(`
How to exclude applications in Bitdefender:
- [bitdefender.com](https://www.bitdefender.com/business/support/en/77212-342964-general.html#UUID-7a762905-3544-7885-d4f5-7110909909d5_N1667164575537
Here you can report false positives:
- https://www.bitdefender.com/submit/
`),
        ],
    },
};
