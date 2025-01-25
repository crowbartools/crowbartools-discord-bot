import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const arm64InstallError: InfoTopic = {
    name: 'ARM macOS Install Error',
    message: {
        embeds: [
            getBaseEmbed().setTitle('ARM macOS (Apple Silicon) Install Error')
                .setDescription(`
Because we do not notarize the ARM macOS builds of Firebot, you may get an error about the app being damaged or incomplete. This is a security feature of macOS called Gatekeeper.

To resolve this issue, run the following command in Terminal:
\`\`\`bash
xattr -c /Applications/Firebot.app
\`\`\`

This command will remove the quarantine attribute from the app and allow it to open.
`),
        ],
    },
};
