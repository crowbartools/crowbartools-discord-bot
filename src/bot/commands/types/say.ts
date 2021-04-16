import { ICommandType } from '../../models/command';

const command: ICommandType = {
    triggers: ['!say'],
    description: 'Make the bot say something.',
    deleteTrigger: true,
    async execute(message, userCommand) {
        const isAdmin = message.member.roles.cache.find(c => c.name === 'Admin');
        if (!isAdmin) return;

        const args = userCommand.args;
        if (args.length === 0) {
            return;
        }

        let replyChannel = message.channel;
        if (message.mentions.channels.size > 0) {
            replyChannel = message.mentions.channels.first();
            args.shift();
        }

        if (args.length > 0) {
            replyChannel.send(args.join(' '));
        }
    },
};

export default command;
