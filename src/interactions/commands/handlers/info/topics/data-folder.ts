import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const dataFolder: InfoTopic = {
    name: 'Data Folder',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Data Folder').setDescription(`
You can get to Firebot's data folder via File > Open Data Folder or by pressing "Win + R" and pasting: \`%appdata%\\firebot\\v5\\\`
`),
        ],
    },
};
