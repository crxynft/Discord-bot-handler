module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(
        `Error executing slash command ${interaction.commandName}:`,
        error,
      );
      await interaction.reply({
        content: "There was an error executing this command!",
        ephemeral: true,
      });
    }
  },
};
