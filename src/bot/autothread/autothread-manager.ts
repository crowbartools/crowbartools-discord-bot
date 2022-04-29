import { Message } from 'discord.js';
import NodeCache from 'node-cache';
import { limitString } from '../../common/util';

const IGNORE_ROLES = [
    '912046561943502868', //crowbar team
    '372819709604921355', //dev
    '372822224987750400', //mod
    '539563107065004063', //firebot expert
    '723971547563294720', //test role
];

const autoThreadCooldownCache = new NodeCache({ stdTTL: 30, checkperiod: 30 });

const autoThreadChannels: Record<string, string> = {
    //questions channel
    '372818514312167424':
        "{user} Thanks for dropping by with your question! I've created this thread for follow up messages. We'll get to your question as soon as possible :)",
    //issues channel
    '911520084256768050':
        "{user} Sorry you are having an issue! I've created this thread for follow up messages. Any steps to reproduce and/or screenshots (if applicable) will be really helpful! We'll get to you as soon as possible :)",
    //test channel
    '844947380272627712': '{user} Test reply',
};

export async function handleAutoThread(message: Message): Promise<void> {
    // ignore messages in threads
    if (message.channel.isThread()) return;

    // ignore messages that are replies
    if (message.reference != null) return;

    const hasIgnoreRole = message.member.roles.cache.some(c =>
        IGNORE_ROLES.includes(c.id)
    );
    if (hasIgnoreRole) return;

    const autoThreadMessage = autoThreadChannels[message.channelId];
    if (autoThreadMessage) {
        const cooldownCacheKey = `${message.author.id}:${message.channelId}`;
        if (autoThreadCooldownCache.has(cooldownCacheKey)) return;

        autoThreadCooldownCache.set(cooldownCacheKey, true);

        const thread = await message.startThread({
            name: limitString(message.content, 30, '...'),
            autoArchiveDuration: 4320,
            reason: 'Auto-thread by CrowbarBot',
        });

        thread.send(
            autoThreadMessage.replace('{user}', `<@${message.author.id}>`)
        );
    }
}
