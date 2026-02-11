const {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  PermissionsBitField
} = require("discord.js");

const fs = require("fs");

const TOKEN = process.env.TOKEN;

const CHANNEL_PANEL_ID = "#auto-pembayaran"; 
const KONFIRM_CHANNEL_ID = "#konfirmasi-pembayaran";

const QRIS_IMAGE = "https://raw.githubusercontent.com/lmore000022-a11y/auto-order/main/qris.png";
const PRICE = "Rp40.000";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.once("clientReady", async () => {
  console.log(`Bot login sebagai ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_PANEL_ID);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("buy")
      .setLabel("BUY AKUN")
      .setStyle(ButtonStyle.Success)
  );

  await channel.send({
    content: "🛒 **AUTO ORDER GTA 5 ROLEPLAY ANDROID**\nKlik tombol di bawah untuk membeli akun.",
    components: [row]
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  // BUY BUTTON
  if (interaction.customId === "buy") {

    await interaction.reply({
      content: "📩 Cek DM untuk pembayaran.",
      ephemeral: true
    });

    await interaction.user.send({
      content: `Silakan scan QRIS berikut untuk pembayaran ${PRICE}\n\nSetelah transfer, kirim bukti pembayaran di channel <#${KONFIRM_CHANNEL_ID}>.`,
      files: [QRIS_IMAGE]
    });
  }

  // ADMIN CONFIRM BUTTON
  if (interaction.customId.startsWith("confirm_")) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "❌ Hanya admin yang bisa konfirmasi.",
        ephemeral: true
      });
    }

    const userId = interaction.customId.split("_")[1];
    const user = await client.users.fetch(userId);

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

    await user.send({
      content: `🎉 Pembayaran dikonfirmasi!\n\nBerikut akun kamu:\n\n${account}\n\nJangan dibagikan ke siapa pun.`
    });

    await interaction.reply({
      content: "✅ Akun berhasil dikirim ke pembeli.",
      ephemeral: true
    });
  }
});

client.on(Events.MessageCreate, async (message) => {

  if (message.channel.id === KONFIRM_CHANNEL_ID && !message.author.bot) {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`confirm_${message.author.id}`)
        .setLabel("KONFIRM PEMBAYARAN")
        .setStyle(ButtonStyle.Success)
    );

    await message.reply({
      content: `🔔 @here Admin, pembeli <@${message.author.id}> mengirim bukti pembayaran.`,
      components: [row]
    });
  }
});

client.login(TOKEN);
