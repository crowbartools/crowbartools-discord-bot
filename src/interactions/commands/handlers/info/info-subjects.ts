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
        {
            name: 'Manual Restore',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('Manual Restore').setDescription(`
If you are having issues with the automatic restore process within Firebot, you can manually restore a backup with the following steps.
## Manual Restore Steps for V5
1. Make sure you have the backup .zip file that you want to restore from handy
    - The file name will look something like \`backup_1583810006278_v5.8.0.zip\`
    - You can find backups zips from within Firebot via **Settings > Backup > Manage Backups > Open Backups Folder**
    - Or via the Run app (Win key + R) and paste in \`%appdata%\\Firebot\\v5\\backups\\\`
2. Close down Firebot
3. Open the Run app (Win key + R) and paste in \`%appdata%\\Firebot\\v5\\\`, then click OK.
4. In the file browser window that appears, DELETE the  **profiles** folder and the **global-settings** file.
5. Extract the contents of the backup zip from Step 1 into this folder to replace the just deleted **profiles** folder and **global-settings** file.
6. Start Firebot.
`),
                ],
            },
        },
        {
            name: 'Guides and Tutorials',
            message: {
                content: "Guides and Tutorials by the community",
                embeds: [
                    getBaseEmbed().setTitle('Guides and Tutorials').setDescription(`
Hi, here you can see a short list of guides and tutorials made by the community for Firebot:

A YouTube Firebot tutorial playlist by heyaapl:
https://www.youtube.com/playlist?list=PL4AUBPu8fw6jfzEvd-GYw357uSNJBt53E

A written guide by Tío on Google Drive:
https://drive.google.com/drive/folders/1jQzl-kfIdeMTlo6yC7gUxWtyBtSDKYpI

If you have made one or know of anyone else that have made something like this for Firebot please tell us so that we can add it to this list and to our Getting Started page over of the Firebot Github Wiki:
https://github.com/crowbartools/Firebot/wiki/Getting-Started
`),
                ],
            },
        }, 
        {
            name: 'Fresh Install',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('Fresh Install').setDescription(`
To perform a fresh install:
1: Exit Firebot
2: Copy the contents of %appdata%\\firebot\\v5\\ somewhere else (as a back up)
3: Delete %appdata%\\firebot
4: Delete %localappdata%\\firebotv5 and/or %localappdata%\\firebot 
5: Download latest version: https://firebot.app/
6: Run the installer
`),
                ],
            },
        },
        {
            name: 'Bit Defender',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('Bit Defender').setDescription(`
How to exclude applications in Bitdefender:
- [bitdefender.com](https://www.bitdefender.com/business/support/en/77212-342964-general.html#UUID-7a762905-3544-7885-d4f5-7110909909d5_N1667164575537
Here you can report false positives:
- https://www.bitdefender.com/submit/
`),
                ],
            },
        },
        {
            name: 'But Another Bot Does It',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('But Another Bot Does It?').setDescription(`
Just a friendly reminder, just because Software A supports something, that doesn't mean that Software B is required to support it.
Things you want won't always appear in the software you use.
This is true in all walks of computer life and why there are so many tools that do the same thing.
`),
                ],
            },
        },
        {
            name: 'Discord Mentions',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('Discord Mentions').setDescription(`
With developer mode enabled in Discord, go to the Roles section in your Discord server settings, tap on the three-dot menu next to the role you want to mention, then Copy ID.
Then use \`<@&roleid>\` in the message (e.g. \`<@&9471923849123483>\`).
`),
                ],
            },
        },
        {
            name: 'Firebot Expert',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('Firebot Expert Role').setDescription(`
**What is It**
The Firebot Expert role acknowledges members of the community that have shown over time through their own initiative and merit to be insightful and helpful when it comes to user questions.

It serves to denote for other users that the individual is speaking from extensive knowledge and experience of Firebot's usage. The individual's advice/support should be weighted more heavily than that of normal users. However, this does not mean the user speaks from authority or for the Firebot dev team.


**How To Get It**
The Firebot Expert role is earned by an individual through a consistent showing of knowledge in regards to Firebot and a willingness to apply that knowledge via offering support to user questions. The individual must also have a positive impact on the community.

We do not accept applications, referrals or requests in regards to the role. Nor is there a set of criteria that must be met for the individual to receive the role. When a member of the dev team notices a user they deem fit for the role, that member will bring the user up to the other dev members and the role is given if a consensus is met.
`),
                ],
            },
        },
        {
            name: 'Data Folder',
            message: {
                embeds: [
                    getBaseEmbed().setTitle('Data Folder').setDescription(`
You can get to Firebot's data folder via File > Open Data Folder or by pressing "Win + R" and pasting: \`%appdata%\\firebot\\v5\\\`
`),
                ],
            },
        },
    ];
