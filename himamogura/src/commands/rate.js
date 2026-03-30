// /rate command — Rate a hobby from your collection
import {
  SlashCommandBuilder,
  EmbedBuilder,
} from "discord.js";
import {
  getOrCreateUser,
  getUserHobbies,
  rateUserHobby,
  getUserHobby,
  getHobbyById,
} from "../database.js";
import { COLORS, CATEGORY_EMOJI } from "../data/hobbies.js";
import { moleArt, pickLine } from "../data/mascot.js";

export const data = new SlashCommandBuilder()
  .setName("rate")
  .setDescription("趣味を評価しよう！")
  .addIntegerOption((option) =>
    option
      .setName("hobby_id")
      .setDescription("趣味のID番号")
      .setRequired(true)
      .setMinValue(1)
  )
  .addIntegerOption((option) =>
    option
      .setName("stars")
      .setDescription("評価（1〜5つ星）")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(5)
  );

export async function execute(interaction) {
  getOrCreateUser(interaction.user.id, interaction.user.username);

  const hobbyId = interaction.options.getInteger("hobby_id");
  const stars = interaction.options.getInteger("stars");

  // Check if hobby exists
  const hobby = getHobbyById(hobbyId);
  if (!hobby) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.default)
          .setDescription("その趣味は見つからなかったよ...IDを確認してね！"),
      ],
      ephemeral: true,
    });
  }

  // Check if user has this hobby
  const userHobby = getUserHobby(interaction.user.id, hobbyId);
  if (!userHobby) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.default)
          .setDescription(
            `**${hobby.name}**はまだコレクションにないよ！\n先に /dig で見つけて「やってみる！」してね。`
          ),
      ],
      ephemeral: true,
    });
  }

  rateUserHobby(interaction.user.id, hobbyId, stars);

  const ratingStars = "⭐".repeat(stars) + "☆".repeat(5 - stars);
  const emoji = CATEGORY_EMOJI[hobby.category] || "•";
  const line = pickLine("rated");

  // Reaction based on rating
  let reaction;
  if (stars === 5) {
    reaction = moleArt.excited("最高評価！やっぱりモグラの目利きは確かだった！");
  } else if (stars >= 3) {
    reaction = moleArt.happy("まあまあだね！もっと合う趣味を探そうか？");
  } else {
    reaction =
      "```\n    ∩ ∩\n   (；ω；)  < 合わなかったか...\n   /  つ\n```\nドンマイ！趣味は相性だから、次いこう次！";
  }

  const embed = new EmbedBuilder()
    .setColor(COLORS[hobby.category] || COLORS.default)
    .setTitle(`${emoji} ${hobby.name} を評価！`)
    .setDescription(`${reaction}\n\n${line}`)
    .addFields({
      name: "評価",
      value: ratingStars,
      inline: true,
    })
    .setFooter({
      text: "ヒマモグラ | /collection で全コレクションを確認",
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
