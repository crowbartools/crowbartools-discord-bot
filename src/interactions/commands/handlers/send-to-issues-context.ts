import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { CommandType, ICommandHandler } from '../command-handler.interface';
import { config } from '../../../config';
import { sendMessageToChannel } from '../../../helpers/send-message-helper';

const cmdConfig = new ContextMenuCommandBuilder()
    .setName('Send to #issues')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(0);

export const sendToIssuesContextMenuCommand: ICommandHandler = {
    type: CommandType.MessageContextMenuCommand,
    config: cmdConfig,
    async onTrigger(interaction) {
        await sendMessageToChannel(
            interaction,
            config.discord.channels.issues,
            'issues'
        );
    },
};
