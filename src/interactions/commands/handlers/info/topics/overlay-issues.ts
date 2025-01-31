import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const overlayIssues: InfoTopic = {
    name: 'Overlay Issues',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Video Issues in Overlay').setDescription(`
If you're experiencing issues with videos and audio in your Firebot Overlay, follow these steps to disable Hardware Acceleration:

1. In **OBS Studio** click on File.
    - Click on Settings.
    - Click on Advanced.
    - Scroll down to the bottom; Sources.
    - Disable "Enable Browser Source Hardware Acceleration"
    - Check results in OBS after restarting OBS.

If this for some reason doesn't help, you might need to check the encoding of your video-file.
`),
        ],
    },
};
