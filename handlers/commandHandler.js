const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");

async function loadCommands(client) {
  try {
    // Load Slash Commands
    const slashCommands = fs
      .readdirSync("./commands/slash")
      .filter((file) => file.endsWith(".js"));
    const slashArray = [];

    for (const file of slashCommands) {
      try {
        const command = require(`../commands/slash/${file}`);
        client.commands.set(command.data.name, command);
        slashArray.push(command.data.toJSON());
      } catch (error) {
        console.error(`Error loading slash command ${file}:`, error);
      }
    }

    // Load Prefix Commands
    const prefixCommands = fs
      .readdirSync("./commands/prefix")
      .filter((file) => file.endsWith(".js"));
    for (const file of prefixCommands) {
      try {
        const command = require(`../commands/prefix/${file}`);
        client.prefixCommands.set(command.name, command);
      } catch (error) {
        console.error(`Error loading prefix command ${file}:`, error);
      }
    }

    // Register Slash Commands
    if (slashArray.length) {
      const rest = new REST({ version: "10" }).setToken(client.token);
      try {
        console.log("Started refreshing application commands...");
        await rest.put(
          Routes.applicationGuildCommands(client.user.id, client.guildId),
          {
            body: slashArray,
          },
        );
        console.log("Successfully reloaded application commands.");
      } catch (error) {
        console.error("Error registering slash commands:", error);
      }
    }
  } catch (error) {
    console.error("Error during command loading:", error);
  }
}

module.exports = { loadCommands };
