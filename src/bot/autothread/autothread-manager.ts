import {
    ButtonInteraction,
    GuildMemberRoleManager,
    Message,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from 'discord.js';
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
        "Thanks for dropping by with your question, {user}! I've created this thread for follow up messages. We'll get back to you as soon as possible :slight_smile:",
    //issues channel
    '911520084256768050':
        "Sorry you are having an issue, {user}! I've created this thread for follow up messages. Any steps to reproduce and/or screenshots (if applicable) will be really helpful! We'll get back to you as soon as possible :slight_smile:",
    //test channel
    '844947380272627712':
        "Sorry you are having an issue, {user}! I've created this thread for follow up messages. Any steps to reproduce and/or screenshots (if applicable) will be really helpful! We'll get back to you as soon as possible :slight_smile:",
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

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('keepThread')
                .setLabel('✅ Keep thread')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('removeThread')
                .setLabel('⛔ Remove thread')
                .setStyle('SECONDARY')
        );

        const autoReply = await thread.send({
            embeds: [
                new MessageEmbed()
                    .setColor('BLUE')
                    .setDescription(
                        autoThreadMessage.replace(
                            '{user}',
                            message.author.username
                        )
                    ),
                new MessageEmbed()
                    .setColor('DARK_GREY')
                    .addField(
                        "Don't need this thread?",
                        '*Let me know with the buttons below*'
                    ),
            ],
            components: [row],
        });

        setTimeout(async () => {
            try {
                const updatedReply = await autoReply.fetch(true);
                if (updatedReply.editable && updatedReply.embeds.length === 2) {
                    updatedReply.edit({
                        embeds: [updatedReply.embeds[0]],
                        components: [],
                    });
                }
            } catch {
                //fail silently
            }
        }, 30000);
    }
}

export async function handleThreadButtonPress(
    interaction: ButtonInteraction
): Promise<void> {
    try {
        if (!interaction.channel.isThread()) {
            return;
        }
        const hasIgnoreRole = (interaction.member
            .roles as GuildMemberRoleManager).cache.some(c =>
            IGNORE_ROLES.includes(c.id)
        );
        const starterMessage = await interaction.channel.fetchStarterMessage();
        const hasPermission =
            starterMessage.author.id === interaction.user.id || hasIgnoreRole;

        if (!hasPermission) {
            interaction.reply({
                content: "You don't have permission to do this.",
                ephemeral: true,
            });
            return;
        }

        if (interaction.customId === 'keepThread') {
            await (interaction.message as Message).edit({
                embeds: [interaction.message.embeds[0] as MessageEmbed],
                components: [],
            });
        } else if (interaction.customId === 'removeThread') {
            await interaction.channel.delete(
                `${interaction.user.username} marked thread as unneeded.`
            );
        }
    } catch (error) {
        console.log('failed to handle button press');
    }
}
