const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

const commands = [
	{
		name: 'botautorole',
		description: 'Automatically assign a role to yourself',
		options: [
			{
				type: 8, // ROLE
				name: 'role',
				description: 'The role to assign',
				required: true,
			},
		],
	},
	{
		name: 'gen',
		description: 'Generate a service from stock',
		options: [
			{
				type: 3, // STRING
				name: 'service',
				description: 'The service to generate',
				required: true,
			},
		],
	},
	{
		name: 'stock',
		description: 'List available stock and amounts',
	},
	{
		name: 'addstock',
		description: 'Add items to stock',
		options: [
			{
				type: 3, // STRING
				name: 'service',
				description: 'The service to add stock to',
				required: true,
			},
			{
				type: 3, // STRING
				name: 'items',
				description: 'The items to add, separated by commas',
				required: true,
			},
		],
	},
	{
		name: 'help',
		description: 'List available commands',
	},
	{
		name: 'ban',
		description: 'Ban a user (Owner only)',
		options: [
			{
				type: 6, // USER
				name: 'user',
				description: 'The user to ban',
				required: true,
			},
		],
	},
	{
		name: 'kick',
		description: 'Kick a user (Owner only)',
		options: [
			{
				type: 6, // USER
				name: 'user',
				description: 'The user to kick',
				required: true,
			},
		],
	},
	{
		name: 'botinfo',
		description: 'Show bot information (CPU, RAM, uptime)',
	},
	{
		name: 'time',
		description: 'Show current time in London',
	},
	{
		name: 'weather',
		description: 'Show current weather in Derbyshire',
	},
	{
		name: 'proxy',
		description: 'List proxies from a source',
		options: [
			{
				type: 4, // INTEGER
				name: 'amount',
				description: 'The amount of proxies to fetch',
				required: true,
			},
		],
	},
	{
		name: 'proxytest',
		description: 'Test proxies',
		options: [
			{
				type: 3, // STRING
				name: 'proxies',
				description: 'List of proxies to test (comma separated)',
				required: true,
			},
		],
	},
	{
		name: 'clear',
		description: 'Clear messages in a channel',
		options: [
			{
				type: 4, // INTEGER
				name: 'amount',
				description: 'Number of messages to clear',
				required: true,
			},
		],
	},
	{
		name: 'spam',
		description: 'Spam a message (Owner only)',
		options: [
			{
				type: 3, // STRING
				name: 'message',
				description: 'Message to spam',
				required: true,
			},
			{
				type: 4, // INTEGER
				name: 'times',
				description: 'Number of times to send the message',
				required: true,
			},
		],
	},
	{
		name: 'about',
		description: 'Information about the bot',
	},
	{
		name: 'obfuscate',
		description: 'Obfuscate JavaScript code',
		options: [
			{
				type: 3, // STRING
				name: 'code',
				description: 'JavaScript code to obfuscate',
				required: true,
			},
		],
	},
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
