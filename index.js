const { token, dbIP, dbUser, dbPass, dbName } = require('./config.json');
//discord js deps ---v
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql');
let databaseReady = false;

const database = mysql.createConnection({
	host: dbIP,
	user: dbUser,
	password: dbPass,
	database: dbName
});

database.connect(function(err){
	if (err) {
		databaseReady = false;
		throw err;
	};
	console.log("Připojeno k MySQL!");
	databaseReady = true;
})


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//command handling (ukradeno z guidu 🥀🥀🥀)
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction,database);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});
//konec command handlingu
client.once(Events.ClientReady, readyClient => {
    console.log("Úspěšně přihlášen jako: " + readyClient.user.tag);
})

client.login(token);