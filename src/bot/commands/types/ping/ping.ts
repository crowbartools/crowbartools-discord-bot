import { ICommandType } from '../../../models/command';

const command: ICommandType = {
    triggers: ['!ping'],
    description: 'Ping! Pong!',
    deleteTrigger: false,
    execute(message) {
        message.channel.send('Pong.');
    },
};

export default command;
