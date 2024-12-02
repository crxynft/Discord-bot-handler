const {
  Client,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");
const { token, prefix, guildId } = require("./config.json");
const { loadEvents } = require("./handlers/eventHandler");
const { loadCommands } = require("./handlers/commandHandler");
const { connectToDatabase } = require("./database/mongoose");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection(); // For slash commands
client.prefixCommands = new Collection(); // For prefix commands

client.prefix = prefix;
client.guildId = guildId;

(async () => {
  try {
    // Log in the bot first
    await client.login(token);
    console.log(`Logged in as ${client.user.tag}`);

    // Load events and commands
    await loadEvents(client);
    await loadCommands(client);
  } catch (error) {
    console.error("Critical error during startup:", error);
  }
})();

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});

// Catch uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

// Gracefully handle SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  console.log("Bot shutting down...");
  client.destroy();
  process.exit(0);
});

(async () => {
  await connectToDatabase();
  console.log("Database connection established");
})();

client.once("ready", () => {
  client.user.setPresence({
    activities: [
      {
        type: ActivityType.Custom,
        name: "Playing testing!",
      },
    ],
    status: "online",
  });
});
