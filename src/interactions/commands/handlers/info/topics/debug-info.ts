import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const debugInfo: InfoTopic = {
    name: 'Debug Info',
    message: {
        content:
            'To help us assist you more effectively, please provide your debug info.',
        embeds: [
            getBaseEmbed().setTitle('Debug Info').setDescription(`
To copy your Firebot debug info:  
1. In Firebot, click on the **Help** menu in the top menu bar.  
2. Select **Copy Debug Info...**  

This will copy useful diagnostic information to your clipboard.

Please paste the copied debug info in this thread so we can better assist you.
`),
        ],
    },
};
