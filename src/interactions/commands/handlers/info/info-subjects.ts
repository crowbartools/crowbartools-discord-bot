import { APIEmbedField, EmbedAssetData } from "discord.js";
/*  templet
    {
        name: "name",
        caption: "",
        value: {
            color: 0xffbd00,
            title: 'Some title',
            url: 'https://discord.js.org',
            author: {
                name: 'Firebot Support',
                icon_url: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
            },
            description: 'Some description here',
            thumbnail: {
                url: 'https://i.imgur.com/AfFp7pu.png',
            },
            fields: [
                {
                    name: 'Regular field title',
                    value: 'Some value here',
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: false,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
                {
                    name: 'Inline field title',
                    value: 'Some value here',
                    inline: true,
                },
            ],
            image: {
                url: 'https://i.imgur.com/AfFp7pu.png',
            },
            footer: {
                text: 'Some footer text here',
                icon_url: 'https://i.imgur.com/AfFp7pu.png',
            },
        }
    }
*/

interface image {
    url: string
};
interface APIEmbedFooter {
    text: string;
    url?: string;
    icon_url?: string;
};
interface APIEmbedAuthor {
    name: string;
    url?: string;
    icon_url?: string;
};
interface Embed {
    title?: string;
    color?: number;
    description?: string;
    url?: string;
    footer?: APIEmbedFooter;
    image?: image;
    thumbnail?: EmbedAssetData;
    author?: APIEmbedAuthor;
    fields?: APIEmbedField[];
    video?: EmbedAssetData;
};
export const infoSubjects: Array<{
    name: string;
    caption?: string;
    value?: Embed;
}> = [
        {
            name: "offScreen",
            caption: "",
            value: {
                color: 0xffbd00,
                title: 'Off Screen?',
                author: {
                    name: 'Firebot Support',
                    icon_url: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                },
                description: `Having issues with Firebot starting off screen or in some other weird place?
                - Close Firebot
                - Press Windows + R to open the Windows Run dialog
                - Then paste\`%appdata%/Firebotv5\` into the box and press enter.
                - Delete the file: \`window-state.json\``,
            }
        },
        {
            name: "obssettings",
            caption: "OBS WebSocket related issues",
            value: {
                color: 0xffbd00,
                title: 'OBS WebSocket Settings',
                author: {
                    name: 'Firebot Support',
                    icon_url: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                },
                description: `
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
                `
            }
        },
        {
            name: "installlog",
            caption: "We are requesting your install log to futher help you",
            value: {
                color: 0xffbd00,
                title: 'Instal Logs',
                author: {
                    name: 'Firebot Support',
                    icon_url: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                },
                description: `You can get to Firebot's data folder via File > Open Data Folder or by pressing "Win + R" and pasting: \`%appdata%\firebot\v5\`
                Please find the file named \`SquirrelSetup.log\` which is located in \`%localappdata%\Firebotv5\`
                and / or \`%localappdata%\Firebotv5\` 
                and / or \`%localappdata%\SquirrelTemp\` 
                and post it in this thread.`
            }
        },
        {
            name: "backuprequest",
            caption: "please send us your latest backup zip",
            value: {
                color: 0xffbd00,
                title: 'OBS WebSocket Settings',
                author: {
                    name: 'Firebot Support',
                    icon_url: 'https://raw.githubusercontent.com/crowbartools/Firebot/master/src/gui/images/logo.png',
                },
                description: `Here's how you can do that: 
                - Open Firebot and go to **Settings** > **Backup** 
                - Press **Backup Now** 
                - Next, go to **Manage Backups** > **Open Backups Folder** 
                - DM {user} the latest **backup.zip** in that folder`
            }
        },
    ];
