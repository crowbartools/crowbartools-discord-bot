import {
    getSupportPolicyEmbed,
    getSupportPolicyLinkButton,
    InfoTopic,
} from '../info-helpers';

export const supportPolicy: InfoTopic = {
    name: 'Support Policy',
    message: async () => {
        return {
            embeds: [await getSupportPolicyEmbed()],
            components: [getSupportPolicyLinkButton()],
        };
    },
};
