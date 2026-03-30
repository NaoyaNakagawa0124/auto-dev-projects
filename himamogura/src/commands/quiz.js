// /quiz command — Interactive personality quiz for hobby matching
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  StringSelectMenuBuilder,
} from "discord.js";
import { getOrCreateUser, updateQuizResult, getHobbiesByCategory } from "../database.js";
import { COLORS, CATEGORY_EMOJI, CATEGORY_NAME_JA } from "../data/hobbies.js";
import {
  quizQuestions,
  calculateQuizScores,
  getTopCategory,
  getSortedCategories,
} from "../data/quizzes.js";
import { moleArt, pickLine } from "../data/mascot.js";

export const data = new SlashCommandBuilder()
  .setName("quiz")
  .setDescription("性格診断で最適な趣味を見つけよう！");

export async function execute(interaction) {
  getOrCreateUser(interaction.user.id, interaction.user.username);

  const answers = [];
  let currentQuestion = 0;

  // Start with first question
  const startEmbed = new EmbedBuilder()
    .setColor(COLORS.default)
    .setTitle("🔮 趣味タイプ診断")
    .setDescription(
      moleArt.thinking +
        "\nモグラの趣味診断、はじまるよ〜！\n5つの質問に答えてね。"
    );

  const firstQ = quizQuestions[0];
  const questionEmbed = buildQuestionEmbed(firstQ, 1, quizQuestions.length);
  const row = buildQuestionRow(firstQ, 0);

  const response = await interaction.reply({
    embeds: [startEmbed, questionEmbed],
    components: [row],
    fetchReply: true,
  });

  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.StringSelect,
    time: 120_000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "これは他の人の診断だよ！自分で /quiz してみてね",
        ephemeral: true,
      });
    }

    const value = i.values[0];
    const questionIndex = parseInt(
      i.customId.replace("quiz_question_", ""),
      10
    );
    const question = quizQuestions[questionIndex];

    answers.push({ questionId: question.id, value });
    currentQuestion = questionIndex + 1;

    if (currentQuestion < quizQuestions.length) {
      // Show next question
      const nextQ = quizQuestions[currentQuestion];
      const nextEmbed = buildQuestionEmbed(
        nextQ,
        currentQuestion + 1,
        quizQuestions.length
      );
      const nextRow = buildQuestionRow(nextQ, currentQuestion);
      const progressEmbed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setTitle("🔮 趣味タイプ診断")
        .setDescription(
          `進捗: ${"🟤".repeat(currentQuestion)}${"⚪".repeat(quizQuestions.length - currentQuestion)} (${currentQuestion}/${quizQuestions.length})`
        );
      await i.update({
        embeds: [progressEmbed, nextEmbed],
        components: [nextRow],
      });
    } else {
      // All questions answered — show results
      const scores = calculateQuizScores(answers);
      updateQuizResult(interaction.user.id, scores);
      const topCategory = getTopCategory(scores);
      const sorted = getSortedCategories(scores);

      // Get recommended hobbies from top category
      const recommendedHobbies = getHobbiesByCategory(topCategory);
      // Pick 3 random ones
      const shuffled = recommendedHobbies
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const categoryEmoji = CATEGORY_EMOJI[topCategory];
      const categoryName = CATEGORY_NAME_JA[topCategory];

      const resultEmbed = new EmbedBuilder()
        .setColor(COLORS[topCategory])
        .setTitle(`🎉 診断結果: ${categoryEmoji} ${categoryName}タイプ！`)
        .setDescription(
          moleArt.excited("分析完了！") +
            `\n\nあなたは **${categoryEmoji} ${categoryName}** タイプだよ！\n${getTypeDescription(topCategory)}`
        )
        .addFields(
          {
            name: "📊 タイプ別スコア",
            value: sorted
              .map(
                ({ category, score }) =>
                  `${CATEGORY_EMOJI[category]} ${CATEGORY_NAME_JA[category]}: ${"█".repeat(score)}${"░".repeat(Math.max(0, 15 - score))} (${score})`
              )
              .join("\n"),
          },
          {
            name: "🎯 おすすめの趣味",
            value: shuffled
              .map(
                (h) =>
                  `**${h.name}**（${h.name_en}）\n└ ${h.description}`
              )
              .join("\n\n"),
          }
        )
        .setFooter({
          text: "ヒマモグラ | /dig でもっと趣味を掘ろう！",
        })
        .setTimestamp();

      await i.update({ embeds: [resultEmbed], components: [] });
    }
  });

  collector.on("end", (collected, reason) => {
    if (reason === "time" && collected.size < quizQuestions.length) {
      const timeoutEmbed = new EmbedBuilder()
        .setColor(COLORS.default)
        .setDescription(
          moleArt.sleepy +
            "\n時間切れ...モグラ寝ちゃった。\nまた /quiz で診断してみてね！"
        );
      interaction
        .editReply({ embeds: [timeoutEmbed], components: [] })
        .catch(() => {});
    }
  });
}

function buildQuestionEmbed(question, num, total) {
  return new EmbedBuilder()
    .setColor(COLORS.default)
    .setTitle(`質問 ${num}/${total}`)
    .setDescription(`**${question.question}**\n\n下のメニューから選んでね！`);
}

function buildQuestionRow(question, index) {
  const select = new StringSelectMenuBuilder()
    .setCustomId(`quiz_question_${index}`)
    .setPlaceholder("回答を選んでね...")
    .addOptions(
      question.options.map((opt) => ({
        label: opt.label,
        value: opt.value,
      }))
    );

  return new ActionRowBuilder().addComponents(select);
}

function getTypeDescription(category) {
  const descriptions = {
    creative:
      "モノ作りや表現が好きなクリエイター気質！\n頭の中のアイデアを形にすることに喜びを感じるタイプだね。",
    physical:
      "体を動かすのが大好きなアクティブ派！\n新しいスポーツやアウトドア活動にどんどん挑戦しよう。",
    social:
      "人との繋がりを大切にするソーシャルタイプ！\nみんなと一緒に楽しめる趣味がぴったりだよ。",
    learning:
      "知識欲旺盛な学びの探求者！\n新しいことを知る喜びを誰よりも感じられるタイプだね。",
    relaxation:
      "心のゆとりを大切にするヒーリングタイプ！\nゆっくり自分のペースで楽しめる趣味が向いてるよ。",
  };
  return descriptions[category] || "";
}
