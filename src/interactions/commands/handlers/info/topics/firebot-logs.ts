import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const firebotLogs: InfoTopic = {
    name: 'Firebot Logs',
    message: {
        content: 'Please post your latest Firebot log file',
        embeds: [
            getBaseEmbed().setTitle('How to locate your Logs folder')
                .setDescription(`
1. In Firebot, go to **File** > **Open Logs Folder**  
   - or -  
2. Press **Win + R**, paste \`%appdata%\\Firebot\\v5\\logs\\\` into the field, and click **OK**.  
`),
        ],
    },
};
