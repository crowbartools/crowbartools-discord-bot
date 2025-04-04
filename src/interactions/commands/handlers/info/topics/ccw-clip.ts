import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const ccwClip: InfoTopic = {
    name: 'Clip Content Classification Warning',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Twitch Clip Classification Warning').setDescription(`
Playing a Twitch clip in your overlay may display a content classification warning instead of the desired clip. These warnings are added by Twitch, and are divided up into the following categories:

- Mature-Rated Game
- Sexual Themes
- Drugs, Intoxication, or Excessive Tobacco use
- Violence and Graphic Depictions
- Significant Profanity or Vulgarity
- Gambling

To dismiss the warning, and see the desired clip:

1. **Right-click** your Firebot Overlay source in *Open Broadcast Studio (OBS)*, and select **Interact**.
2. Play the clip (again) in Firebot.
3. Click the **Start Watching** button inside of the *Interacting with Firebot* OBS window.
  - This button may be translated differently depending on your language, but should *generally* be purple.

The warning for those particular classification categories should not reappear for another month.
`),
        ],
    },
};
