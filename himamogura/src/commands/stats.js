// /stats command — Personal statistics
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getOrCreateUser, getUserStats } from "../database.js";
import { COLORS, CATEGORY_EMOJI, CATEGORY_NAME_JA } from "../data/hobbies.js";
import { moleArt } from "../data/mascot.js";

export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("自分の趣味スタッツを確認！");

export async function execute(interaction) {
  getOrCreateUser(interaction.user.id, interaction.user.username);
  const stats = getUserStats(interaction.user.id);

  if (!stats) {
    return interaction.reply({
      content: "データが見つからなかったよ...",
      ephemeral: true,
    });
  }

  const level = getHobbyLevel(stats.hobbyCount);
  const favoriteCategory =
    stats.categoryBreakdown.length > 0
      ? stats.categoryBreakdown[0]
      : null;

  // Build category bar chart using emoji
  const barChart =
    stats.categoryBreakdown.length > 0
      ? stats.categoryBreakdown
          .map(({ category, count }) => {
            const emoji = CATEGORY_EMOJI[category] || "•";
            const name = CATEGORY_NAME_JA[category] || category;
            const bar = "█".repeat(Math.min(count, 20));
            return `${emoji} ${name}: ${bar} (${count})`;
          })
          .join("\n")
      : "まだデータがないよ";

  const mole = stats.hobbyCount > 0
    ? moleArt.happy("いい感じだね！")
    : moleArt.sleepy;

  const embed = new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle(`📊 ${interaction.user.username}のスタッツ`)
    .setDescription(mole)
    .addFields(
      {
        name: "🏷️ 趣味レベル",
        value: level,
        inline: true,
      },
      {
        name: "📦 コレクション",
        value: `${stats.hobbyCount} / ${stats.totalHobbies} (${stats.completionPercent}%)`,
        inline: true,
      },
      {
        name: "⭐ 平均評価",
        value: stats.avgRating ? `${stats.avgRating} / 5.0` : "未評価",
        inline: true,
      },
      {
        name: "🔥 現在のストリーク",
        value: `${stats.user.streak}日連続`,
        inline: true,
      },
      {
        name: "🏆 ベストストリーク",
        value: `${stats.user.best_streak}日`,
        inline: true,
      },
      {
        name: "❤️ お気に入りカテゴリ",
        value: favoriteCategory
          ? `${CATEGORY_EMOJI[favoriteCategory.category] || "•"} ${CATEGORY_NAME_JA[favoriteCategory.category] || favoriteCategory.category}`
          : "まだなし",
        inline: true,
      },
      {
        name: "📊 カテゴリ別内訳",
        value: barChart,
      }
    )
    .setFooter({
      text: "ヒマモグラ | /dig でもっと趣味を集めよう！",
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

export function getHobbyLevel(count) {
  if (count >= 50) return "🌟 伝説のモグラ";
  if (count >= 30) return "👑 マスター";
  if (count >= 15) return "🗺️ 探検家";
  if (count >= 5) return "🔰 見習い探検家";
  if (count >= 1) return "🐣 初心者";
  return "🥚 まだ冒険が始まっていない";
}
