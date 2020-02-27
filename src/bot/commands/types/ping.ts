import { ICommandType } from '../../models/command';

const command: ICommandType = {
    trigger: '!ping',
    description: 'Ping! Pong!',
    deleteTrigger: false,
    ignoreCase: true,
    execute(message) {
        message.channel.send('Pong.');
    },
};

export default command;