import { SlashCommandBuilder, } from 'discord.js';
import { CommandType, ICommandHandler } from '../../command-handler.interface';
import { infoSubjects } from './info-subjects';

const config = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Firebot information subjects')
    .addStringOption((option) =>
        option
            .setName('subject')
            .setDescription('the subject to post')
            .setRequired(false)
            .setChoices(
                infoSubjects.map((s) => ({
                    name: s.name,
                    value: s.value?.title ?? s.name,
                }))
            )
    );

export const infoSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const subjectName = interaction.options.getString('subject');

        if (!subjectName) {
            return;
        }

        const subject = infoSubjects.find((p) => p.name === subjectName);
        if (subject.value?.description?.includes("{user}")) {
            subject.value.description = subject.value.description.replaceAll("{user}", `${interaction.user}`)
        }
        if (subject.caption?.includes("{user}")) {
            subject.caption = subject.caption.replaceAll("{user}", `${interaction.user}`)
        }
        await interaction.editReply({ content: subject.caption, embeds: [subject.value] });
    },
};
