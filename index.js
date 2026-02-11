const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ActionRowBuilder,
  Events 
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel]
});

const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {

  // SLASH COMMAND PANEL
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "panel") {

      const embed = new EmbedBuilder()
        .setTitle("🛒 BUY AKUN GTA 5 RP ANDROID")
        .setDescription("Harga: **Rp40.000 (QRIS GoPay)**\nKlik tombol di bawah untuk membeli.")
        .setColor("Green");

      const button = new ButtonBuilder()
        .setCustomId("buy")
        .setLabel("BUY 40K")
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({ embeds: [embed], components: [row] });
    }
  }

  // BUTTON BUY
  if (interaction.isButton()) {

    if (interaction.customId === "buy") {

      const embed = new EmbedBuilder()
        .setTitle("💳 Pembayaran QRIS")
        .setDescription("Silakan transfer **Rp40.000** ke QRIS di bawah.\n\nSetelah transfer, tunggu admin konfirmasi.")
        .setImage("LINK_GAMBAR_QRIS_KAMU")
        .setColor("Blue");

      const confirmButton = new ButtonBuilder()
        .setCustomId("confirm")
        .setLabel("CONFIRM (ADMIN)")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(confirmButton);

      await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    // ADMIN CONFIRM
    if (interaction.customId === "confirm") {

      const file = fs.readFileSync("./accounts.txt", "utf-8").split("\n").filter(Boolean);

      if (file.length === 0) {
        return interaction.reply({ content: "Stok habis!", ephemeral: true });
      }

      const account = file.shift(); // ambil akun pertama
      fs.writeFileSync("./accounts.txt", file.join("\n"));

      try {
        await interaction.user.send(`🎉 Pembayaran dikonfirmasi!\n\nBerikut akun kamu:\n\n${account}`);
      } catch {
        return interaction.reply({ content: "Gagal DM user!", ephemeral: true });
      }

      await interaction.reply({ content: "Akun berhasil dikirim ke DM pembeli!", ephemeral: true });
    }

  }

});

client.login(TOKEN);
