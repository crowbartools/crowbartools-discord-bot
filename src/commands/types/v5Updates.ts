import ICommandType from '../ICommandType';

import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { RichEmbed } from 'discord.js';
import { ICommitData } from '../../models/github';

const command: ICommandType = {
    trigger: '!v5updates',
    description: 'List recent v5 commit messages.',
    ignoreCase: true,
    deleteTrigger: false,
    async execute(message) {
        const sinceDate = moment()
            .subtract('month', 1)
            .format();
        const v5CommitsUrl = `https://api.github.com/repos/crowbartools/Firebot/commits?sha=v5&since=${sinceDate}`;

        let response: AxiosResponse<ICommitData[]>;
        try {
            response = await axios.get<ICommitData[]>(v5CommitsUrl, {
                headers: {
                    'User-Agent': 'ebiggz/CrowbarToolsDiscordBot',
                },
            });
        } catch (error) {
            console.log('Error getting recent v5 commit messages', error);
            return;
        }

        if (response.status !== 200) {
            console.log('Failed to get recent v5 commit messages');
            return;
        }

        const commits = response.data;
        const commitMessages = commits.slice(0, 10).map(c => {
            return {
                message: c.commit.message,
                name: c.author.login,
                date: moment(c.commit.committer.date).format('h:mm A MM/DD/YYYY'),
            };
        });

        const embed = new RichEmbed()
            .setColor(0x00a4cf)
            .setAuthor(
                'Recent V5 Commits',
                'https://raw.githubusercontent.com/crowbartools/Firebot/master/gui/images/logo_transparent.png',
                'https://github.com/crowbartools/Firebot/commits/v5'
            );

        for (const cm of commitMessages) {
            embed.addField(cm.message, `*${cm.name}* (${cm.date})`);
        }

        // Send the embed to the same channel as the message
        message.channel.send(embed);
    },
};

export default command;
