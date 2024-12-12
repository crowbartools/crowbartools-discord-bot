import { getBaseEmbed } from "../info-slash";

export const cloudBackups = {
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
};