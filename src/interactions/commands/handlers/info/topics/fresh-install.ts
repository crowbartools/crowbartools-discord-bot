import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const reinstall: InfoTopic = {
    name: 'Fresh Install',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Fresh Install').setDescription(`
To perform a fresh install:
1: Exit Firebot
2: Copy the contents of %appdata%\\firebot\\v5\\ somewhere else (as a back up)
3: Delete %appdata%\\firebot
4: Delete %localappdata%\\firebotv5 and/or %localappdata%\\firebot 
5: Download latest version: https://firebot.app/
6: Run the installer
`),
        ],
    },
};
