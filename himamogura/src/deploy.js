// Slash command deployment script
import { REST, Routes } from "discord.js";
import { config } from "dotenv";

import * as dig from "./commands/dig.js";
import * as quiz from "./commands/quiz.js";
import * as collection from "./commands/collection.js";
import * as rate from "./commands/rate.js";
import * as challenge from "./commands/challenge.js";
import * as stats from "./commands/stats.js";
import * as ranking from "./commands/ranking.js";

config();

const commands = [dig, quiz, collection, rate, challenge, stats, ranking].map(
  (cmd) => cmd.data.toJSON()
);

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function deploy() {
  try {
    console.log(`🐹 ${commands.length}個のコマンドを登録中...`);

    if (process.env.GUILD_ID) {
      // Guild-specific (instant, for testing)
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commands }
      );
      console.log(`✅ ギルド ${process.env.GUILD_ID} にコマンド登録完了！`);
    } else {
      // Global (takes up to 1 hour to propagate)
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
      console.log("✅ グローバルコマンド登録完了！（反映まで最大1時間）");
    }
  } catch (error) {
    console.error("❌ コマンド登録エラー:", error);
  }
}

deploy();
