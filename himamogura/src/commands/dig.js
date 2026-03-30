// /dig command — Random hobby suggestion
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
  getRandomUntriedHobby,
  addUserHobby,
  getHobbyById,
} from "../database.js";
import { hobbies, COLORS, CATEGORY_EMOJI, CATEGORY_NAME_JA } from "../data/hobbies.js";
import { moleArt, pickLine } from "../data/mascot.js";

export const data = new SlashCommandBuilder()
  .setName("dig")
  .setDescription("モグラが趣味を掘り出してくるよ！")
  .addStringOption((option) =>
    option
      .setName("category")
      .setDescription("カテゴリを指定する？")
      .setRequired(false)
      .addChoices(
        { name: "🎨 クリエイティブ", value: "creative" },
        { name: "💪 フィジカル", value: "physical" },
        { name: "🤝 ソーシャル", value: "social" },
        { name: "📚 学び", value: "learning" },
        { name: "🧘 リラクゼーション", value: "relaxation" }
      )
  );

export async function execute(interaction) {
  const user = getOrCreateUser(
    interaction.user.id,
    interaction.user.username
  );
  const category = interaction.options.getString("category");

  const hobby = getRandomUntriedHobby(interaction.user.id, category);

  if (!hobby) {
    const embed = new EmbedBuilder()
      .setColor(COLORS.gold)
      .setTitle("🎉 全制覇おめでとう！")
      .setDescription(
        moleArt.excited("すごい！全部の趣味を試したんだ！") +
          "\nもう掘り出すものがないよ...伝説のモグラだね！"
      );
    return interaction.reply({ embeds: [embed] });
  }

  const hobbyId = hobby.id;
  const line = pickLine("dig");
  const stars = "⭐".repeat(hobby.difficulty) + "☆".repeat(5 - hobby.difficulty);
  const costIndicator = "💰".repeat(hobby.cost) + "・".repeat(5 - hobby.cost);
  const locationTag = hobby.indoor ? "🏠 インドア" : "🌳 アウトドア";
  const tags = hobby.tags ? JSON.parse(hobby.tags).map((t) => `\`${t}\``).join(" ") : "";
  const categoryEmoji = CATEGORY_EMOJI[hobby.category] || "🔵";
  const categoryName = CATEGORY_NAME_JA[hobby.category] || hobby.category;

  const embed = new EmbedBuilder()
    .setColor(COLORS[hobby.category] || COLORS.default)
    .setTitle(`${categoryEmoji} ${hobby.name}（${hobby.name_en}）`)
    .setDescription(moleArt.digging + `\n**${line}**\n\n${hobby.description}`)
    .addFields(
      {
        name: "📂 カテゴリ",
        value: `${categoryEmoji} ${categoryName}`,
        inline: true,
      },
      { name: "🎯 難易度", value: stars, inline: true },
      { name: "💰 コスト", value: costIndicator, inline: true },
      { name: "📍 場所", value: locationTag, inline: true },
      { name: "🏷️ タグ", value: tags || "なし", inline: true }
    )
    .setFooter({
      text: "ヒマモグラ | /dig で次の趣味を掘る",
    })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`try_hobby_${hobbyId}`)
      .setLabel("やってみる！")
      .setStyle(ButtonStyle.Success)
      .setEmoji("⛏️"),
    new ButtonBuilder()
      .setCustomId(`skip_hobby_${hobbyId}`)
      .setLabel("パス")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("👋")
  );

  const response = await interaction.reply({
    embeds: [embed],
    components: [row],
    fetchReply: true,
  });

  // Button collector
  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60_000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "これは他の人の趣味掘りだよ！自分で /dig してみてね",
        ephemeral: true,
      });
    }

    if (i.customId.startsWith("try_hobby_")) {
      addUserHobby(interaction.user.id, hobbyId);
      const successEmbed = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle("✨ コレクションに追加！")
        .setDescription(
          moleArt.happy("やった〜！") +
            `\n**${hobby.name}**をコレクションに追加したよ！\n楽しんでね！ /rate で評価も忘れずに〜`
        );
      await i.update({ embeds: [embed, successEmbed], components: [] });
    } else if (i.customId.startsWith("skip_hobby_")) {
      const skipEmbed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(
          "了解！また /dig で別のを掘り出すね〜🕳️"
        );
      await i.update({ embeds: [embed, skipEmbed], components: [] });
    }
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time" && collected.size === 0) {
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`try_hobby_${hobbyId}`)
          .setLabel("やってみる！")
          .setStyle(ButtonStyle.Success)
          .setEmoji("⛏️")
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId(`skip_hobby_${hobbyId}`)
          .setLabel("パス")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("👋")
          .setDisabled(true)
      );
      interaction.editReply({ components: [disabledRow] }).catch(() => {});
    }
  });
}
