import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const authIssues: InfoTopic = {
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
};
