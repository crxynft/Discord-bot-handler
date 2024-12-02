module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (!message.content.startsWith(client.prefix) || message.author.bot)
      return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(`Error executing prefix command ${commandName}:`, error);
      message.reply("There was an error executing this command!");
    }
  },
};
