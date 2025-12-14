import {
    ActionRowBuilder,
    APIEmbedField,
    BaseMessageOptions,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { getSupportedFirebotVersionField } from '../../../../services/github.service';

export function getBaseEmbed() {
    return new EmbedBuilder().setColor('#FFBE00');
}

export type InfoTopic = {
    name: string;
    message: BaseMessageOptions | (() => Promise<BaseMessageOptions>);
};

export async function getSupportPolicyEmbed(): Promise<EmbedBuilder> {
    
    const fields: APIEmbedField[] = [];
    
    const supportedVersionsField = await getSupportedFirebotVersionField();
    if (supportedVersionsField) {
        fields.push(supportedVersionsField);
    }

    fields.push({
        name: 'Policy Summary',
        value: [
            '- Latest stable release is always supported',
            '- Previous stable releases are supported for up to **30 days** after a newer stable update',
            '- Betas are unsupported once a newer beta or corresponding stable release is available',
            '- Nightly builds receive limited support due to their unstable nature',
        ].join('\n'),
        inline: false,
    });

    return getBaseEmbed()
        .setTitle('Support Policy')
        .setDescription(
            'To provide the best possible support experience for both our users and volunteers, we maintain a support policy that defines which versions of Firebot are eligible for assistance.'
        )
        .addFields(...fields);
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
