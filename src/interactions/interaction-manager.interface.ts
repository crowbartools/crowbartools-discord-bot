import { Interaction, InteractionType } from 'discord.js';

export interface IInteractionManager {
    interactionTypes: InteractionType[];
    loadHandlers: () => void;
    handleInteraction: (interaction: Interaction) => Promise<void>;
}
