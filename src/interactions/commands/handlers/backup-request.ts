import { EmbedBuilder, SlashCommandBuilder, userMention } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { replaceVariables } from '../../../helpers/variable-replacer';
function getBaseEmbed() {
    return new EmbedBuilder().setColor('#FFBE00');
}
const config = new SlashCommandBuilder()
    .setName('backuprequest')
    .setDescription('Request a users backup')
    .setDefaultMemberPermissions(0);

export const backupRequestCommand: ICommandHandler = {
    type: CommandType.SlashCommand,
    config,
    async onTrigger(interaction) {
        await interaction.deferReply();

        const message = {
            content: 'Please send us your latest backup zip',
            embeds: [
                getBaseEmbed().setTitle('How to send a backup').setDescription(`
- Open Firebot and go to **Settings** > **Backup** 
- Press **Backup Now** 
- Next, go to **Manage Backups** > **Open Backups Folder** 
- DM {user} the latest **backup.zip** in that folder
`),
            ],
        };


        const variableMap = {
            ['{user}']: userMention(interaction.user.id),
        };

        await interaction.editReply(replaceVariables(variableMap, message));
    },
};
