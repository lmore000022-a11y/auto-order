const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events
} = require("discord.js");

const fs = require("fs");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

const QRIS_IMAGE = "https://raw.githubusercontent.com/lmore000022-a11y/auto-order/main/qris.png";
const PRICE = "Rp40.000";

client.once("ready", () => {
  console.log(`Bot login sebagai ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.content === "!panel") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buy")
        .setLabel("BUY AKUN")
        .setStyle(ButtonStyle.Success)
    );

    message.channel.send({
      content: "Klik tombol untuk membeli akun GTA5 Roleplay Android",
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  // BUY BUTTON
  if (interaction.customId === "buy") {
    const confirmRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("paid")
        .setLabel("SUDAH BAYAR")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: "📩 Cek DM untuk pembayaran.",
      ephemeral: true
    });

    await interaction.user.send({
      content: `Silakan scan QRIS berikut untuk pembayaran ${PRICE}`,
      files: [QRIS_IMAGE],
      components: [confirmRow]
    });
  }

  // PAID BUTTON
  if (interaction.customId === "paid") {
    const accountsFile = fs.readFileSync("accounts.txt", "utf-8");
    const accounts = accountsFile.split("\n").filter(a => a.trim() !== "");

    if (accounts.length === 0) {
      return interaction.reply({
        content: "❌ Stok habis.",
        ephemeral: true
      });
    }

    const account = accounts[0];
    accounts.shift();

    fs.writeFileSync("accounts.txt", accounts.join("\n"));

    await interaction.reply({
      content: "✅ Pembayaran dikonfirmasi!",
      ephemeral: true
    });

    await interaction.user.send({
      content: `🎉 Berikut akun kamu:\n\n${account}\n\nJangan dibagikan ke siapa pun.`
    });
  }
});

client.login(TOKEN);
