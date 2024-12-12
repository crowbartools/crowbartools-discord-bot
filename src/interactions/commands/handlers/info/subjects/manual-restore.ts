import { getBaseEmbed } from "../info-slash";

export const manualRestore = {
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
};