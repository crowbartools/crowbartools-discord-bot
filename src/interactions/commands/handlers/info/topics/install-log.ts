import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const instalLog: InfoTopic = {
    name: 'Install Log',
    message: {
        content:
            'To help us assist you more effectively, please provide your install log.',
        embeds: [
            getBaseEmbed().setTitle('Instal Logs').setDescription(`
To locate your Firebot install logs:  
1. Press **Win + R** to open the Run dialog.  
2. Enter one of the following paths and press Enter:  
   - \`%localappdata%\\Firebotv5\\\`  
   - \`%localappdata%\\SquirrelTemp\\\`  

Look for a file named \`SquirrelSetup.log\`. If you don't see it in the first location, try the second.

Once you've located the file, please upload it to this thread.
`),
        ],
    },
};
