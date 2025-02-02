// Importing SlashCommandBuilder is required for every slash command
// We import PermissionFlagsBits so we can restrict this command usage

import { CategoryChannel, VoiceChannel } from "discord.js";
import { CommandType, ICommandHandler } from "../../command-handler.interface";

// We also import ChannelType to define what kind of Channel we are creating
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require(
    "discord.js",
);

const TEMPORARY_CHANNEL_LIFETIME = 5 * 60 * 1000; // 5 minutes
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

const config = new SlashCommandBuilder()
  .setName('createvoicechannel')
  .setDescription('Creates a new voice channel')
  .setDefaultMemberPermissions(0)
  // Voice Channel name
  .addStringOption((option) =>
      option
        .setName("voicechannelname") // option names need to always be lowercase and have no spaces
        .setDescription("Choose the name to give to the voice channel")
        .setMinLength(1) // A Voice Channel needs to be named
        .setMaxLength(25) // Discord will cut-off names past the 25 characters,
        // so that's a good hard limit to set. You can manually increase this if you wish
        .setRequired(true)
    )
  // Voice channel limit of participants
  .addIntegerOption((option) =>
      option
          .setName('voiceuserlimit') // option names need to always be lowercase and have no spaces
          .setDescription(
              'Select the maximum number of concurrent users for the voice channel'
          )
          .setMinValue(2) // A voice channel with less than 2 users will be useless
          // for nearly every case, so we will disable users from creating voice
          // channels that can take less than that
          .setRequired(false)
  )
  // You will usually only want users that can create new Channels to
  // be able to use this command and this is what this line does.
  // Feel free to remove it if you want to allow any users to
  // create new Channels
  // .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  // It's impossible to create Voice Channels inside DMs, so
  // it's in your best interest in disabling this command through DMs
  .setDMPermission(false);

  async function scheduleDeletion(voiceChannel: VoiceChannel) {
    setTimeout(async function checkAndDelete() {
        try {
            // Fetch the latest voice channel state
            const updatedChannel = await voiceChannel.guild.channels.fetch(voiceChannel.id).catch(() => null);

            if (!updatedChannel || updatedChannel.deleted) {
                console.log(`❌ Channel ${voiceChannel.name} already deleted.`);
                return;
            }

            // Properly checking for members before deleting
            console.log(`🔄 Checking users in: ${updatedChannel.name} (Users: ${updatedChannel.members.size})`);
            if (updatedChannel.members.size === 0) {
                console.log(`🗑️ Deleting empty voice channel: ${updatedChannel.name}`);

                await updatedChannel.delete().catch((error) => {
                    if (error.code === 10003) {
                        console.log(`⚠️ Skipping deletion: ${updatedChannel.name} was already deleted.`);
                    } else {
                        console.error(`❌ Unexpected error deleting ${updatedChannel.name}:`, error);
                    }
                });
            } else {
                console.log(`👥 Users are still in ${updatedChannel.name}, checking again in 30 seconds.`);
                setTimeout(checkAndDelete, CHECK_INTERVAL);
            }
        } catch (error) {
            console.error(`❌ Error checking/deleting ${voiceChannel.name}:`, error);
        }
    }, TEMPORARY_CHANNEL_LIFETIME);
}

// Creating the voiceChannel
export const createVoicechat: ICommandHandler = {
  type: CommandType.SlashCommand,
  config,
    
  async onTrigger(interaction) {
    // Before executing any other code, we need to acknowledge the interaction.
    // Discord only gives us 3 seconds to acknowledge an interaction before
    // the interaction gets voided and can't be used anymore.
    await interaction.reply({
      content: "Fetched all input and working on your request!",
    });

    // After acknowledging the interaction, we retrieve the string sent by the user
    const chosenVoiceChannelName = interaction.options.getString("voicechannelname",);
    const voiceChannelUserLimit = interaction.options.getInteger('voiceuserlimit') ?? undefined;
    // Do note that the string passed to the method .getString() needs to
    // match EXACTLY the name of the option provided (line 12 in this file).
    // If it's not a perfect match, this will always return null

    try {
      // Check if this Channel where the command was used is stray
      if (!interaction.channel.parent) {
        // If the Channel where the command was used is stray,
        // create another stray Voice Channel in the server.
        const strayVoiceChannel = await interaction.guild.channels.create({
          name: chosenVoiceChannelName, // The name given to the Channel by the user
          type: ChannelType.GuildVoice, // The type of the Channel created.
          userLimit: voiceChannelUserLimit, // The max number of concurrent users
        });
        // Notice how we are creating a Channel in the list of Channels
        // of the server. This will cause the Channel to spawn at the top
        // of the Channels list, without belonging to any Categories

        // If we managed to create the Channel, edit the initial response with
        // a success message
        await interaction.editReply({
          content: `✅ Created temporary voice channel: **${chosenVoiceChannelName}** as a stray channel!`,
        });
        console.log(`✅ Created temporary voice channel: **${chosenVoiceChannelName}** as a stray channel!`);
        scheduleDeletion(strayVoiceChannel);
        return;
      }
      // Check if this Channel where the command was used belongs to a Category
      if (interaction.channel.parent) {
          // If the Channel where the command was used belongs to a Category,
          // create another Channel in the same Category.
          const category = interaction.channel.parent;

          const categoryVoiceChannel = await category.guild.channels.create({
          name: chosenVoiceChannelName, // The name given to the Channel by the user
          type: ChannelType.GuildVoice, // The type of the Channel created.
          userLimit: voiceChannelUserLimit, // The max number of concurrent users
          parent: category as CategoryChannel,
          });

          // If we managed to create the Channel, edit the initial response with
          // a success message
          await interaction.editReply({
          content:
              `✅ Created temporary voice channel: **${chosenVoiceChannelName}** in the same category!`,
          });
          console.log(`✅ Created temporary voice channel: **${chosenVoiceChannelName}** in the same category!`);
          scheduleDeletion(categoryVoiceChannel);
          return;
      }
    } catch (error) {
      // If an error occurred and we were not able to create the Channel
      // the bot is most likely received the "Missing Permissions" error.
      // Log the error to the console
      console.log(error);
      // Also inform the user that an error occurred and give them feedback
      // about how to avoid this error if they want to try again
      await interaction.editReply({
        content:
          "Your voice channel could not be created! Please check if the bot has the necessary permissions!",
      });
    }
  },
};