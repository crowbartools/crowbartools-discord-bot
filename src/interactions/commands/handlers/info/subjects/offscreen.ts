import { getBaseEmbed } from "../info-slash";

export const offScreen = {
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
};

 