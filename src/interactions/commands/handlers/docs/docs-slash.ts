import { SlashCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../../command-handler.interface';
import { documentationPages } from './doc-pages';

const config = new SlashCommandBuilder()
    .setName('docs')
    .setDescription('Link to Firebot Docs')
    .addStringOption((option) =>
        option
            .setName('page')
            .setDescription('The page to link to')
            .setRequired(false)
            .setChoices(
                documentationPages.map((p) => ({
                    name: p.name,
                    value: p.name,
                }))
            )
    );

export const docsSlashCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const pageName = interaction.options.getString('page');

        if (!pageName) {
            await interaction.editReply({
                content:
                    'Firebot documentation is available at https://docs.firebot.app',
            });
            return;
        }

        const page = documentationPages.find((p) => p.name === pageName);

        await interaction.editReply({
            content: `Check out the ${page.name} documentation here: ${page.url}`,
        });
    },
};
