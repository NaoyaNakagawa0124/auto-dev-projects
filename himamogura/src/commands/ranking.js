// /ranking command — Server leaderboard
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getServerRanking } from "../database.js";
import { COLORS } from "../data/hobbies.js";
import { moleArt } from "../data/mascot.js";
import { getHobbyLevel } from "./stats.js";

export const data = new SlashCommandBuilder()
  .setName("ranking")
  .setDescription("サーバーのランキングを確認！");

export async function execute(interaction) {
  // Fetch server members who have used the bot
  let memberIds;
  try {
    const members = await interaction.guild.members.fetch();
    memberIds = members.map((m) => m.id);
  } catch {
    memberIds = [interaction.user.id];
  }

  const { byHobbies, byStreak } = getServerRanking(memberIds);

  if (byHobbies.length === 0 && byStreak.length === 0) {
    const emptyEmbed = new EmbedBuilder()
      .setColor(COLORS.default)
      .setTitle("🏆 ランキング")
      .setDescription(
        moleArt.sleepy +
          "\nまだ誰もデータがないよ...\nみんなで /dig から始めよう！"
      );
    return interaction.reply({ embeds: [emptyEmbed] });
  }

  const medals = ["🥇", "🥈", "🥉"];

  const hobbyRanking =
    byHobbies.length > 0
      ? byHobbies
          .filter((r) => r.hobby_count > 0)
          .map((r, i) => {
            const medal = i < 3 ? medals[i] : `${i + 1}.`;
            const level = getHobbyLevel(r.hobby_count);
            return `${medal} **${r.username || "不明"}** — ${r.hobby_count}個 ${level}`;
          })
          .join("\n") || "まだデータがないよ"
      : "まだデータがないよ";

  const streakRanking =
    byStreak.length > 0
      ? byStreak
          .filter((r) => r.best_streak > 0)
          .map((r, i) => {
            const medal = i < 3 ? medals[i] : `${i + 1}.`;
            return `${medal} **${r.username || "不明"}** — ${r.best_streak}日`;
          })
          .join("\n") || "まだデータがないよ"
      : "まだデータがないよ";

  const embed = new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle("🏆 サーバーランキング")
    .setDescription(moleArt.excited("誰が一番の趣味マスター？"))
    .addFields(
      {
        name: "📦 趣味コレクション数ランキング",
        value: hobbyRanking,
      },
      {
        name: "🔥 ベストストリークランキング",
        value: streakRanking,
      }
    )
    .setFooter({
      text: "ヒマモグラ | みんなで趣味を掘ろう！",
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
