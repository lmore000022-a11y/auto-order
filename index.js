const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

const app = express();
app.use(express.json());

// ================== DISCORD BOT ==================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Bot online sebagai ${client.user.tag}`);
});

// Command test sederhana
client.on('messageCreate', async (message) => {
  if (message.content === '!ping') {
    message.reply('🏓 Pong! Bot aktif.');
  }
});

// Login pakai ENV (jangan taruh token di file!)
client.login(process.env.TOKEN);

// ================== WEB SERVER (Untuk Render & Webhook) ==================
app.get('/', (req, res) => {
  res.send('🚀 Bot & Server berjalan dengan baik!');
});

// Endpoint webhook (nanti dipakai Tripay)
app.post('/webhook', (req, res) => {
  console.log("Webhook diterima:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌍 Server jalan di port ${PORT}`);
});
