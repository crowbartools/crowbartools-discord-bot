import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction,
    MessageContextMenuCommandInteraction,
    ThreadAutoArchiveDuration,
} from 'discord.js';
import { limitString } from '../util/strings';

const ACTION_ROW = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Send')
        .setStyle(ButtonStyle.Success)
);

export async function sendMessageToChannel(
    interaction: MessageContextMenuCommandInteraction,
    channelId: string,
    channelLabel: 'questions' | 'issues'
) {
    const destinationChannel = interaction.client.channels.cache.get(channelId);

    if (!destinationChannel?.isThreadOnly()) {
        await interaction.reply({
            content: `Sorry, I can't send messages to #${channelLabel}.`,
            ephemeral: true,
        });
        return;
    }

    const message = interaction.options.getMessage('message');

    if (!message) {
        await interaction.reply({
            content: `Sorry, I couldn't find the message to send to #${channelLabel}.`,
            ephemeral: true,
        });
        return;
    }

    if (message.hasThread) {
        await interaction.reply({
            content: `Sorry, I can't send this message to #${channelLabel}.`,
            ephemeral: true,
        });
        return;
    }

    const interactionResponse = await interaction.reply({
        content: `Are sure you want to send [this message](${message.url}) to #${channelLabel}?`,
        components: [ACTION_ROW as any],
        ephemeral: true,
        fetchReply: true,
    });

    let isConfirmed = false;
    try {
        const collectorFilter = (i: MessageComponentInteraction) => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        const confirmationInteraction =
            await interactionResponse.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

        if (confirmationInteraction.customId === 'confirm') {
            isConfirmed = true;
        }
    } catch (error) {
        console.error(error);
        isConfirmed = false;
    }

    if (!isConfirmed) {
        try {
            await interaction.deleteReply();
        } catch (_) {}
        return;
    }

    await interaction.editReply({
        content: `Sending to #${channelLabel}...`,
        components: [],
    });

    const title = trimTextForTitle(message.content);

    const createdForumPost = await destinationChannel.threads.create({
        name: title,
        message: {
            content: `Original message from <@${message.author.id}>:`,
            embeds: [
                {
                    description: limitString(message.content, 400),
                    timestamp: message.createdAt.toISOString(),
                    author: {
                        name: message.author.tag,
                        icon_url: message.author.avatarURL() ?? undefined,
                    },
                },
            ],
        },
        reason: `Thread for ${channelLabel}`,
    });

    const informUserMessage = `Hi there! Your message has been sent to the #${channelLabel} channel. Please continue the conversation there:\n${createdForumPost.url}`;

    // If the original message was in a thread, reply to it instead of creating a new thread
    if (message.channel.isThread()) {
        await message.reply({
            content: informUserMessage,
            allowedMentions: { repliedUser: true },
        });
    } else {
        const thread = await message.startThread({
            name: `Sent to #${channelLabel}`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
        });

        await thread.send({
            content: informUserMessage,
        });

        await thread.setLocked(true, `Message sent to #${channelLabel}`);
    }

    await interaction.editReply({
        content: `Success! View the post [here](${createdForumPost.url}).`,
        components: [],
    });
}

function trimTextForTitle(message: string): string {
    if (message.length <= 100) {
        return message;
    }
    return limitString(message, 97, '...');
}
