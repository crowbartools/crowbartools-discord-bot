import { MessageComponentInteraction } from 'discord.js';

export type IMessageComponentHandler = {
    handleMessageComponentIds: string[];
    onMessageComponentInteraction: (
        interaction: MessageComponentInteraction
    ) => Promise<void>;
};

export function isMessageComponentHandler(
    handler: unknown
): handler is IMessageComponentHandler {
    return (
        handler != null && (handler as any).handleMessageComponentIds != null
    );
}
