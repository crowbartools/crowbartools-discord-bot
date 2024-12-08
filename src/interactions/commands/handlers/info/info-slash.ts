import { SlashCommandBuilder, userMention } from 'discord.js';
import { CommandType, ICommandHandler } from '../../command-handler.interface';
import { infoSubjects } from './info-subjects';
import { replaceVariables } from '../../../../helpers/variable-replacer';

const config = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Firebot info')
    .setDefaultMemberPermissions(0)
    .addStringOption((option) =>
        option
            .setName('subject')
            .setDescription('The subject to post')
            .setRequired(true)
            .setChoices(
                infoSubjects.map((s) => ({
                    name: s.name,
                    value: s.name,
                }))
            )
    )
    .addUserOption((option) =>
        option
            .setName('targetuser')
            .setDescription('The user to target')
            .setRequired(false)
    );

export const infoSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const subjectName = interaction.options.getString('subject');

        const message = infoSubjects.find(
            (p) => p.name === subjectName
        )?.message;

        if (!message) {
            await interaction.editReply('Invalid subject');
            return;
        }

        const user = interaction.options.getUser('targetuser');

        const variableMap = {
            ['{user}']: userMention(interaction.user.id),
            ['{target}']: userMention(user?.id),
        };

        await interaction.editReply(replaceVariables(variableMap, message));
    },
};
