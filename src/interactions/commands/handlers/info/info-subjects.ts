import { BaseMessageOptions, EmbedBuilder } from "discord.js";

function getBaseEmbed() {
    return new EmbedBuilder().setColor('#FFBE00');
}

export const infoSubjects: Array<{
    name: string;
    message: BaseMessageOptions;
}> = [
    {
        name: 'Off Screen',
        message: {
            embeds: [
                getBaseEmbed().setDescription(`
If Firebot is opening off-screen or behaving oddly, follow these steps to reset its window position:  

1. Close Firebot.  
2. Press **Win + R** to open the Run dialog.  
3. Paste \`%appdata%\\Firebotv5\` into the box and press **Enter**.  
4. Delete the file: \`window-state.json\`.  

This will reset Firebot's window position. Reopen Firebot, and it should appear correctly.
`),
            ],
        },
    },
    {
        name: 'OBS Troubleshooting',
        message: {
            embeds: [
                getBaseEmbed().setTitle('OBS Troubleshooting').setDescription(`
If you're experiencing issues with the OBS integration, follow these steps to troubleshoot:  

1. **Remove the OBS WebSocket Script in Firebot, if present**  
   - Navigate to **Settings** > **Scripts** > **Manage Scripts** in Firebot.  
   - Delete the \`OBS WebSockets\` script if you have it installed.  

2. **Check OBS WebSocket Server Settings**  
   - In OBS, go to **Tools** > **WebSocket Server Settings**.  
   - Ensure the server is enabled.  
   - Verify that:  
     - You have set a password.  
     - You know the port number (default is often 4455).  

3. **Verify Firebot OBS Integration Settings**  
   - In Firebot, navigate to **Settings** > **Integrations** > **OBS** > **Configure**
   - Ensure the following match the OBS WebSocket settings:  
     - The **password**.  
     - The **port**.  

4. **Connection Details**  
   - Are you running Firebot on the **same PC** as OBS?  
     - If yes, set the address to \`127.0.0.1\` or \`localhost\`.  
     - If no, ensure you're using the correct IP address of the PC running OBS.
`),
            ],
        },
    },
    {
        name: 'Install Log',
        message: {
            content:
                'To help us assist you more effectively, please provide your install log.',
            embeds: [
                getBaseEmbed().setTitle('Instal Logs').setDescription(`
To locate your Firebot install logs:  
1. Press **Win + R** to open the Run dialog.  
2. Enter one of the following paths and press Enter:  
   - \`%localappdata%\\Firebotv5\\\`  
   - \`%localappdata%\\SquirrelTemp\\\`  

Look for a file named \`SquirrelSetup.log\`. If you don't see it in the first location, try the second.

Once you've located the file, please upload it to this thread.
`),
            ],
        },
    },
    {
        name: 'Backup Request',
        message: {
            content: 'Please send us your latest backup zip',
            embeds: [
                getBaseEmbed().setTitle('How to send a backup').setDescription(`
- Open Firebot and go to **Settings** > **Backup** 
- Press **Backup Now** 
- Next, go to **Manage Backups** > **Open Backups Folder** 
- DM {user} the latest **backup.zip** in that folder
`),
            ],
        },
    },
    {
        name: 'Nightly Builds',
        message: {
            embeds: [
                getBaseEmbed()
                    .setTitle('Nightly Builds')
                    .setDescription(
                        `You can find more information about the Nightly builds [here](https://discord.com/channels/372817064034959370/372821213443129346/973669737877889094).`
                    ),
            ],
        },
    },
    {
        name: 'Firebot Logs',
        message: {
            content: 'Please post your latest Firebot log file',
            embeds: [
                getBaseEmbed().setTitle('How to locate your Logs folder')
                    .setDescription(`
1. In Firebot, go to **File** > **Open Logs Folder**  
   - or -  
2. Press **Win + R**, paste \`%appdata%\\Firebot\\v5\\logs\\\` into the field, and click **OK**.  
`),
            ],
        },
    },
    {
        name: 'Cloud Backups',
        message: {
            embeds: [
                getBaseEmbed().setTitle('Cloud Backups').setDescription(`
If you use OneDrive to back up your documents, you can include the Firebot data folder in your OneDrive backups by creating a symbolic link. Follow these steps:  

1. Open a Command Prompt window.  
2. Paste the following command and press **Enter**:  
   \`mklink /j "%UserProfile%\\OneDrive\\FirebotData" "%appdata%\\Firebot\\v5"\`  

This command creates a symbolic link between your Firebot V5 data folder (where all your bot profiles and settings are stored) and a folder in your OneDrive. This ensures that OneDrive automatically backs up your Firebot data whenever changes are made.

`),
            ],
        },
    },
    {
        name: 'Auth Issues',
        message: {
            embeds: [
                getBaseEmbed().setTitle('Auth Issues').setDescription(`
If you're experiencing issues with Firebot hanging on start up or failing to connect to Twitch, follow these steps to troubleshoot:  

1. **Check Your Antivirus Software**  
   - Verify that your antivirus software hasn't quarantined Firebot.  

2. **Delete Saved Login File**  
   If the issue persists, try deleting the file where Firebot saves login credentials:  
   - Open your Firebot data folder via either of the following methods:
     - **A**:
       - In Firebot, go to **File** > **Open Data Folder**, then exit Firebot.
     - or **B**:
       - Press **Win + R** to open the Run dialog.  
       - Paste \`%appdata%\\Firebot\\v5\\profiles\\\` into the field and press **Enter**.  
       - Open your profile folder.  
   - Delete the file named \`auth-twitch.json\`.  
   - Restart Firebot and log in again.
`),
            ],
        },
    },
];
