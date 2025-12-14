import { SlashCommandBuilder, userMention } from 'discord.js';
import { CommandType, ICommandHandler } from '../../command-handler.interface';
import { infoTopics } from './topics';
import { replaceVariables } from '../../../../helpers/variable-replacer';

const config = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Firebot info')
    .addStringOption((option) =>
        option
            .setName('topic')
            .setDescription('The topic to post')
            .setRequired(true)
            .setChoices(
                infoTopics.map((t) => ({
                    name: t.name,
                    value: t.name,
                }))
            )
    )
    .addUserOption((option) =>
        option
            .setName('target')
            .setDescription('The user to target')
            .setRequired(false)
    );

export const infoSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const topicName = interaction.options.getString('topic');

        const topic = infoTopics.find((p) => p.name === topicName);

        if (!topic?.message) {
            await interaction.editReply('Invalid topic');
            return;
        }

        const message = typeof topic.message === 'function'
            ? await topic.message()
            : topic.message;

        const targetUser = interaction.options.getUser('target');

        const variableMap = {
            ['{user}']: userMention(interaction.user.id),
            ['{target}']: userMention(targetUser?.id),
        };

        await interaction.editReply(replaceVariables(variableMap, message));
    },
};
