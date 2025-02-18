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
2. If that doesn't hel, you can also try disabling GPU compositing for your browser source by following the steps [here](https://gist.github.com/akarak/9b1d7e8731b30b7daa3b640e8cb413b5).

If none of these options work, you might need to check the encoding of your video-file.
`),
        ],
    },
};
