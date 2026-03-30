// /challenge command — Daily hobby challenge with streak tracking
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import {
  getOrCreateUser,
  getOrCreateDailyChallenge,
  completeChallenge,
  getHobbyById,
} from "../database.js";
import { COLORS, CATEGORY_EMOJI, CATEGORY_NAME_JA } from "../data/hobbies.js";
import { moleArt, pickLine, pickStreakLine } from "../data/mascot.js";

export const data = new SlashCommandBuilder()
  .setName("challenge")
  .setDescription("今日のデイリーチャレンジを確認！");

export async function execute(interaction) {
  const user = getOrCreateUser(
    interaction.user.id,
    interaction.user.username
  );

  const today = new Date().toISOString().split("T")[0];
  const challenge = getOrCreateDailyChallenge(today);
  const hobby = getHobbyById(challenge.hobby_id);

  const emoji = hobby ? CATEGORY_EMOJI[hobby.category] || "🎯" : "🎯";
  const categoryName = hobby
    ? CATEGORY_NAME_JA[hobby.category] || hobby.category
    : "";
  const line = pickLine("challenge");

  const alreadyDone = user.last_challenge_date === today;

  const embed = new EmbedBuilder()
    .setColor(alreadyDone ? COLORS.gold : COLORS.streak)
    .setTitle("📅 今日のデイリーチャレンジ")
    .setDescription(
      moleArt.digging +
        `\n**${line}**\n\n` +
        `${emoji} **${challenge.challenge_text}**`
    )
    .addFields(
      {
        name: "🎯 関連趣味",
        value: hobby
          ? `${emoji} ${hobby.name}（${hobby.name_en}）— ${categoryName}`
          : "なし",
        inline: true,
      },
      {
        name: "🔥 現在のストリーク",
        value: `${user.streak}日連続`,
        inline: true,
      },
      {
        name: "🏆 ベストストリーク",
        value: `${user.best_streak}日`,
        inline: true,
      }
    )
    .setFooter({ text: `ヒマモグラ | ${today}` })
    .setTimestamp();

  if (alreadyDone) {
    embed.addFields({
      name: "✅ ステータス",
      value: "今日はもう完了してるよ！偉い！明日もまた来てね〜",
    });
    return interaction.reply({ embeds: [embed] });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("challenge_complete")
      .setLabel("チャレンジ完了！")
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅")
  );

  const response = await interaction.reply({
    embeds: [embed],
    components: [row],
    fetchReply: true,
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 300_000, // 5 minutes
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "これは他の人のチャレンジだよ！自分で /challenge してみてね",
        ephemeral: true,
      });
    }

    if (i.customId === "challenge_complete") {
      const result = completeChallenge(interaction.user.id, today);

      if (result.alreadyDone) {
        return i.reply({
          content: "もう今日のチャレンジは完了済みだよ！",
          ephemeral: true,
        });
      }

      const streakLine = pickStreakLine(result.streak);

      let celebrationText = "";
      if (result.streak >= 30) {
        celebrationText =
          "\n\n🏅 **30日達成！伝説のモグラの称号を授けるよ！**";
      } else if (result.streak >= 14) {
        celebrationText = "\n\n🎖️ **2週間達成！趣味マスターだね！**";
      } else if (result.streak >= 7) {
        celebrationText = "\n\n🎉 **1週間達成！素晴らしい！**";
      } else if (result.streak >= 3) {
        celebrationText = "\n\n💪 **3日連続！調子いいね！**";
      }

      const completeEmbed = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle("🎉 チャレンジ完了！")
        .setDescription(
          moleArt.excited(streakLine) +
            `\n🔥 ストリーク: **${result.streak}日連続**` +
            `\n🏆 ベスト: **${result.bestStreak}日**` +
            celebrationText
        )
        .setTimestamp();

      await i.update({
        embeds: [embed, completeEmbed],
        components: [],
      });
    }
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time" && collected.size === 0) {
      interaction.editReply({ components: [] }).catch(() => {});
    }
  });
}
