// Main bot entry point
import { Client, GatewayIntentBits, Collection, Events } from "discord.js";
import { config } from "dotenv";
import { initDatabase } from "./database.js";
import { pickLine } from "./data/mascot.js";

// Load environment
config();

// Import commands
import * as dig from "./commands/dig.js";
import * as quiz from "./commands/quiz.js";
import * as collection from "./commands/collection.js";
import * as rate from "./commands/rate.js";
import * as challenge from "./commands/challenge.js";
import * as stats from "./commands/stats.js";
import * as ranking from "./commands/ranking.js";

// Initialize database
initDatabase();

// Create client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Register commands
client.commands = new Collection();
const commands = [dig, quiz, collection, rate, challenge, stats, ranking];
for (const cmd of commands) {
  client.commands.set(cmd.data.name, cmd);
}

// Ready event
client.once(Events.ClientReady, (readyClient) => {
  console.log(`🐹 ヒマモグラ起動！ログイン: ${readyClient.user.tag}`);
  console.log(`📡 ${readyClient.guilds.cache.size}サーバーに接続中`);
});

// Interaction handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`コマンドエラー [${interaction.commandName}]:`, error);

    const errorMessage = pickLine("error");
    const replyOptions = {
      content: `❌ ${errorMessage}`,
      ephemeral: true,
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyOptions);
      } else {
        await interaction.reply(replyOptions);
      }
    } catch (replyError) {
      console.error("エラー応答の送信に失敗:", replyError);
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
