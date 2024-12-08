import { BaseMessageOptions, EmbedBuilder } from "discord.js";

export const infoSubjects: Array<{
    name: string;
    message: BaseMessageOptions;
}> = [
        {
            name: "offScreen",
            message: {
                content: "Having issues with Firebot starting off screen or in some other weird place?",
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffbd00)
                        .setTitle('Off Screen?')
                        .setAuthor({
                            name: 'Firebot Support',
                            iconURL: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                        })
                        .setDescription(`
- Close Firebot
- Press Windows + R to open the Windows Run dialog
- Then paste\`%appdata%/Firebotv5\` into the box and press enter.
- Delete the file: \`window-state.json\`
`)
                ]
            }
        },
        {
            name: "obssettings",
            message: {
                content: "OBS WebSocket related issues",
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffbd00)
                        .setTitle('OBS WebSocket Settings')
                        .setAuthor({
                            name: 'Firebot Support',
                            iconURL: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                        })
                        .setDescription(`
firebot
settings> scripts> manage scripts delete OBS WebSockets if you have it.

did you enable the server in OBS?
- on OBS Tools>obs-websockets-server
- is it enabled
- did you set  a password
- what is the port?

did you in integrations set the same password and port from OBS in the obs config of Firebot
- on firebot Left hand side Settings>integrations> OBS config
are the ports the same?
is this the same PC?
- yes
is the address set to 127.0.0.1 or localhost
- no
did you use the address provided by OBS it is a "best guess" and not always correct
`)
                ]
            }
        },
        {
            name: "installlog",
            message: {
                content: "We are requesting your install log to futher help you",
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xffbd00)
                        .setTitle('Instal Logs')
                        .setAuthor({
                            name: 'Firebot Support',
                            iconURL: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                        })
                        .setDescription(`
You can get to Firebot's data folder via File > Open Data Folder or by pressing "Win + R" and pasting: \`%appdata%\firebot\v5\`
Please find the file named \`SquirrelSetup.log\` which is located in \`%localappdata%\Firebotv5\`
and / or \`%localappdata%\Firebotv5\` 
and / or \`%localappdata%\SquirrelTemp\` 
and post it in this thread.
`)
                ]
            }
        },
        {
            name: "backuprequest",
            message: {
                content: "please send us your latest backup zip",
                embeds: [
                    new EmbedBuilder()
                .setColor(0xffbd00)
                .setTitle('OBS WebSocket Settings')
                .setAuthor ({
                    name: 'Firebot Support',
                    iconURL: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                })
                .setDescription (`
Here's how you can do that: 
- Open Firebot and go to **Settings** > **Backup** 
- Press **Backup Now** 
- Next, go to **Manage Backups** > **Open Backups Folder** 
- DM {user} the latest **backup.zip** in that folder
`)
                ]
            }
        },
    ];
