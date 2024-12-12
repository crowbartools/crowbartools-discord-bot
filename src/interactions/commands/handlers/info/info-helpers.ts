import { BaseMessageOptions, EmbedBuilder } from 'discord.js';

export function getBaseEmbed() {
    return new EmbedBuilder().setColor('#FFBE00');
}

export type InfoTopic = {
    name: string;
    message: BaseMessageOptions;
};
