const fs = require("fs");

async function loadEvents(client) {
  const eventFiles = fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    try {
      const event = require(`../events/${file}`);
      if (event.once) {
        client.once(event.name, (...args) => {
          try {
            event.execute(...args, client);
          } catch (error) {
            console.error(`Error executing event ${event.name}:`, error);
          }
        });
      } else {
        client.on(event.name, (...args) => {
          try {
            event.execute(...args, client);
          } catch (error) {
            console.error(`Error executing event ${event.name}:`, error);
          }
        });
      }
      console.log(`Loaded event: ${event.name}`);
    } catch (error) {
      console.error(`Error loading event file ${file}:`, error);
    }
  }
}

module.exports = { loadEvents };
