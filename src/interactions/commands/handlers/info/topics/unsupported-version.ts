import {
    getSupportPolicyEmbed,
    getSupportPolicyLinkButton,
    InfoTopic,
} from '../info-helpers';

export const unsupportedVersion: InfoTopic = {
    name: 'Unsupported Version',
    message: async () => {
        return {
            content:
                'It looks like you may be running an unsupported version of Firebot. To receive support, please update to a supported version of Firebot.',
            embeds: [await getSupportPolicyEmbed()],
            components: [getSupportPolicyLinkButton()],
        };
    },
};
