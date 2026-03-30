// /collection command — View tried hobbies with ratings
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";
import { getOrCreateUser, getUserHobbies } from "../database.js";
import { COLORS, CATEGORY_EMOJI, CATEGORY_NAME_JA } from "../data/hobbies.js";
import { moleArt, pickLine } from "../data/mascot.js";

const ITEMS_PER_PAGE = 5;

export const data = new SlashCommandBuilder()
  .setName("collection")
  .setDescription("自分の趣味コレクションを見よう！");

export async function execute(interaction) {
  getOrCreateUser(interaction.user.id, interaction.user.username);
  const hobbies = getUserHobbies(interaction.user.id);

  if (hobbies.length === 0) {
    const emptyEmbed = new EmbedBuilder()
      .setColor(COLORS.default)
      .setTitle("📦 趣味コレクション")
      .setDescription(
        moleArt.sleepy +
          `\n${pickLine("noHobbies")}\n\n/dig で趣味を掘り出してみよう！`
      );
    return interaction.reply({ embeds: [emptyEmbed] });
  }

  const totalPages = Math.ceil(hobbies.length / ITEMS_PER_PAGE);
  let currentPage = 0;

  const embed = buildCollectionEmbed(hobbies, currentPage, interaction.user);
  const row = buildPaginationRow(currentPage, totalPages);

  const response = await interaction.reply({
    embeds: [embed],
    components: totalPages > 1 ? [row] : [],
    fetchReply: true,
  });

  if (totalPages <= 1) return;

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 120_000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "これは他の人のコレクションだよ！",
        ephemeral: true,
      });
    }

    if (i.customId === "collection_prev") {
      currentPage = Math.max(0, currentPage - 1);
    } else if (i.customId === "collection_next") {
      currentPage = Math.min(totalPages - 1, currentPage + 1);
    }

    const newEmbed = buildCollectionEmbed(
      hobbies,
      currentPage,
      interaction.user
    );
    const newRow = buildPaginationRow(currentPage, totalPages);
    await i.update({ embeds: [newEmbed], components: [newRow] });
  });

  collector.on("end", () => {
    interaction.editReply({ components: [] }).catch(() => {});
  });
}

function buildCollectionEmbed(hobbies, page, user) {
  const totalPages = Math.ceil(hobbies.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const pageItems = hobbies.slice(start, start + ITEMS_PER_PAGE);

  // Category breakdown
  const categories = {};
  for (const h of hobbies) {
    categories[h.category] = (categories[h.category] || 0) + 1;
  }
  const breakdown = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([cat, count]) =>
        `${CATEGORY_EMOJI[cat] || "•"} ${CATEGORY_NAME_JA[cat] || cat}: ${count}`
    )
    .join(" | ");

  const hobbyList = pageItems
    .map((h) => {
      const rating = h.rating ? "⭐".repeat(h.rating) : "未評価";
      const emoji = CATEGORY_EMOJI[h.category] || "•";
      return `${emoji} **${h.name}**（${h.name_en}）— ${rating}`;
    })
    .join("\n");

  return new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle(`📦 ${user.username}の趣味コレクション`)
    .setDescription(
      `全 **${hobbies.length}** 個の趣味を試したよ！\n\n${hobbyList}`
    )
    .addFields({
      name: "📊 カテゴリ内訳",
      value: breakdown || "なし",
    })
    .setFooter({
      text: `ページ ${page + 1}/${totalPages} | /rate で評価しよう`,
    })
    .setTimestamp();
}

function buildPaginationRow(currentPage, totalPages) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("collection_prev")
      .setLabel("◀ 前")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage === 0),
    new ButtonBuilder()
      .setCustomId("collection_page")
      .setLabel(`${currentPage + 1} / ${totalPages}`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId("collection_next")
      .setLabel("次 ▶")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentPage === totalPages - 1)
  );
}

// Exported for tests
export { buildCollectionEmbed, ITEMS_PER_PAGE };
