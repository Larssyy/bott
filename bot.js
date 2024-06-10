const { Client, Intents, GatewayIntentBits, ActivityType } = require('discord.js');
const fs = require('fs');
const axios = require('axios');
const os = require('os');
const moment = require('moment-timezone');
const config = require('./config.json');
const JavaScriptObfuscator = require('javascript-obfuscator');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

let stats = [];
const stock = {};

// Function to read statuses from stats.txt
function loadStatuses() {
    fs.readFile('stats.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading stats.txt:', err);
            return;
        }
        stats = data.split('\n').filter(line => line.trim().length > 0);
    });
}

// Function to update bot status
function updateStatus() {
    if (stats.length === 0) return;
    const status = stats[Math.floor(Math.random() * stats.length)];
    client.user.setActivity(status, { type: ActivityType.Watching });
}

client.once('ready', () => {
    console.log('Bot is online!');
    loadStatuses();
    updateStatus();
    // Update status every 30 seconds
    setInterval(updateStatus, 30000);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'botautorole') {
        const role = options.getRole('role');
        if (role) {
            await interaction.member.roles.add(role);
            await interaction.reply(`Role ${role.name} added!`);
        } else {
            await interaction.reply('Role not found.');
        }
    } else if (commandName === 'gen') {
        const service = options.getString('service');
        if (stock[service] && stock[service].length > 0) {
            await interaction.user.send(`Here is your ${service}: ${stock[service].pop()}`);
            await interaction.reply(`Check your DMs for the ${service}.`);
        } else {
            await interaction.reply('Out of stock or service not found.');
        }
    } else if (commandName === 'stock') {
        let stockInfo = 'Current stock:\n';
        for (const service in stock) {
            stockInfo += `${service}: ${stock[service].length}\n`;
        }
        await interaction.reply(stockInfo);
    } else if (commandName === 'addstock') {
        const service = options.getString('service');
        const items = options.getString('items').split(',');
        if (!stock[service]) stock[service] = [];
        stock[service].push(...items);
        await interaction.reply(`Added ${items.length} items to ${service} stock.`);
    } else if (commandName === 'help') {
        await interaction.reply(`Commands:
        /botautorole [role]
        /gen [service]
        /stock
        /addstock [service] [items]
        /help
        /ban [user]
        /kick [user]
        /botinfo
        /time
        /weather
        /proxy [amount]
        /proxytest [proxies]
        /clear [amount]
        /spam [message] [times]
        /about
        /obfuscate [code]`);
    } else if (commandName === 'ban') {
        if (interaction.user.id === config.ownerId) {
            const user = options.getUser('user');
            if (user) {
                const member = interaction.guild.members.cache.get(user.id);
                if (member) {
                    await member.ban();
                    await interaction.reply(`${user.tag} was banned.`);
                } else {
                    await interaction.reply('User not found.');
                }
            }
        } else {
            await interaction.reply('You do not have permission to ban users.');
        }
    } else if (commandName === 'kick') {
        if (interaction.user.id === config.ownerId) {
            const user = options.getUser('user');
            if (user) {
                const member = interaction.guild.members.cache.get(user.id);
                if (member) {
                    await member.kick();
                    await interaction.reply(`${user.tag} was kicked.`);
                } else {
                    await interaction.reply('User not found.');
                }
            }
        } else {
            await interaction.reply('You do not have permission to kick users.');
        }
    } else if (commandName === 'botinfo') {
        const uptime = moment.duration(client.uptime).humanize();
        const cpu = os.cpus()[0].model;
        const ram = (os.totalmem() - os.freemem()) / (1024 * 1024 * 1024);
        await interaction.reply(`Bot Info:
        Uptime: ${uptime}
        CPU: ${cpu}
        RAM: ${ram.toFixed(2)} GB`);
    } else if (commandName === 'time') {
        const londonTime = moment().tz('Europe/London').format('HH:mm:ss');
        await interaction.reply(`Current time in London: ${londonTime}`);
    } else if (commandName === 'weather') {
        // Implement weather fetching logic here
        await interaction.reply('Weather feature coming soon!');
    } else if (commandName === 'proxy') {
        const amount = options.getInteger('amount');
        try {
            const response = await axios.get('https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt');
            const proxies = response.data.split('\n').slice(0, amount).join('\n');
            await interaction.reply(`Proxy List:\n${proxies}`);
        } catch (error) {
            console.error('Error fetching proxies:', error);
            await interaction.reply('Failed to fetch proxies.');
        }
    } else if (commandName === 'proxytest') {
        const proxies = options.getString('proxies').split(',');
        // Implement proxy testing logic here
        await interaction.reply('Proxy testing feature coming soon!');
    } else if (commandName === 'clear') {
        const amount = options.getInteger('amount');
        // Implement message clearing logic here
        await interaction.reply('Message clearing feature coming soon!');
    } else if (commandName === 'spam') {
        if (interaction.user.id === config.ownerId) {
            const message = options.getString('message');
            const times = options.getInteger('times');
            // Implement message spamming logic here
            await interaction.reply('Message spamming feature coming soon!');
        } else {
            await interaction.reply('You do not have permission to spam messages.');
        }
    } else if (commandName === 'about') {
        await interaction.reply('This bot was made by Larsy.');
    } else if (commandName === 'obfuscate') {
        const code = options.getString('code');
        const obfuscatedCode = JavaScriptObfuscator.obfuscate(code).getObfuscatedCode();
        await interaction.reply(`Obfuscated code:\n\`\`\`${obfuscatedCode}\`\`\``);
    }
});

client.login(config.token);
