import {
    ActionRowBuilder,
    BaseMessageOptions,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { getSupportedFirebotVersions } from '../../../../services/github.service';

export function getBaseEmbed() {
    return new EmbedBuilder().setColor('#FFBE00');
}

export type InfoTopic = {
    name: string;
    message: BaseMessageOptions | (() => Promise<BaseMessageOptions>);
};

export async function getSupportPolicyEmbed(): Promise<EmbedBuilder> {
    const supportedVersions = await getSupportedFirebotVersions();

    // Build the list of currently supported versions
    const versionLines: string[] = [];
    if (supportedVersions.currentStable) {
        versionLines.push(`- **${supportedVersions.currentStable}** (Latest)`);
    }
    if (
        supportedVersions.previousStable &&
        supportedVersions.previousStableExpiresAt
    ) {
        versionLines.push(
            `- **${supportedVersions.previousStable}** (Previous - support expires <t:${supportedVersions.previousStableExpiresAt}:R>)`
        );
    }
    if (supportedVersions.prerelease) {
        versionLines.push(
            `- **${supportedVersions.prerelease}** (Pre-release)`
        );
    }

    const currentlySupportedSection =
        versionLines.length > 0
            ? `**Currently Supported Versions:**\n${versionLines.join('\n')}\n\n`
            : '';
    return getBaseEmbed().setTitle('Support Policy').setDescription(`
${currentlySupportedSection}**Policy Summary:**
- Latest stable release is always supported
- Previous stable releases are supported for up to **30 days** after a newer stable update
- Betas are unsupported once a newer beta or corresponding stable release is available
- Nightly builds receive limited support due to their unstable nature

To receive support, please update to a supported version of Firebot.
`);
}

export function getSupportPolicyLinkButton() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setLabel('View Full Support Policy')
            .setStyle(ButtonStyle.Link)
            .setURL(
                'https://github.com/crowbartools/Firebot/blob/master/.github/SUPPORT.md'
            )
    );
}
