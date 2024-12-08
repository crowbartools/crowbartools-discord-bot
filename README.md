# crowbartools-discord-bot
 A bot that helps service the Crowbar Tools Discord server.

![Tests](https://github.com/crowbartools/crowbartools-discord-bot/workflows/Tests/badge.svg?branch=master)


## Local Development

### Prereqs
- Clone the repo
- Run `npm install`
- Create a test server in Discord, if you don't already have one. This is where you'll eventually install your local bot to and can test commands in.

### Setting up .env 
- Duplicate the **example.env** file and rename it to just ".env"

### Create a test discord bot app
- Sign into the [Discord Dev Portal](https://discord.com/developers/applications)
- Create a new Application, call it whatever you like (eg "TestCrowbarBot")
- Add the app to your server
  - In the settings area of the newly created app, go to the "Installation" tab.
  - Uncheck "User Install" under **Installation Contexts**
  - Under **Default Install Settings**, add the "bot" scope and add the "Administrator" permission
  - Copy the **Install Link** and paste it in a browser
  - This should open up Discord with a prompt to install your application in a server. 
  - Select your test server, click Continue, and then click Authorize (don't uncheck any permissions)
- Update discord .env vars
  - Bot App Id
    - In the settings area of the newly created app, go to the "General Information" tab
    - Copy the **Application ID** and paste in your .env for `DISCORD_BOT_APP_ID`
  - Discord Token
    - In the settings area of the newly created app, go to the "Bot" tab
    - Under the "Token" section, click **Reset Token** and then copy the new value and paste in your .env for `DISCORD_TOKEN`
  - Discord Server (Guild) ID
    - Open up Discord, right click the icon for your test server and select "Copy Server ID", paste it in your .env for `DISCORD_GUILD_ID`
    - If you don't see the copy option, you probably need to enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
  - All other env vars can be left empty unless you need to test those specific features (eg github issue creation, sent to questions/issues commands, etc)

### Run the bot
- `npm run dev`
- You should now see the bot show as "online" in your test server and slash commands should now be available to run
