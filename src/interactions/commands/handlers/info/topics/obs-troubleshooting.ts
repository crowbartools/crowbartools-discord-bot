import { getBaseEmbed, InfoTopic } from '../info-helpers';

export const obsTroubleShooting: InfoTopic = {
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
};
