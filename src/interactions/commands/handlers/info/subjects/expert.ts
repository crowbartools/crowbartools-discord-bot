import { getBaseEmbed } from "../info-slash";

export const expert = {
    name: 'Firebot Expert',
    message: {
        embeds: [
            getBaseEmbed().setTitle('Firebot Expert Role').setDescription(`
**What is It**
The Firebot Expert role acknowledges members of the community that have shown over time through their own initiative and merit to be insightful and helpful when it comes to user questions.

It serves to denote for other users that the individual is speaking from extensive knowledge and experience of Firebot's usage. The individual's advice/support should be weighted more heavily than that of normal users. However, this does not mean the user speaks from authority or for the Firebot dev team.


**How To Get It**
The Firebot Expert role is earned by an individual through a consistent showing of knowledge in regards to Firebot and a willingness to apply that knowledge via offering support to user questions. The individual must also have a positive impact on the community.

We do not accept applications, referrals or requests in regards to the role. Nor is there a set of criteria that must be met for the individual to receive the role. When a member of the dev team notices a user they deem fit for the role, that member will bring the user up to the other dev members and the role is given if a consensus is met.
`),
        ],
    },
};