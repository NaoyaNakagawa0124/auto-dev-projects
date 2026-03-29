/**
 * Laika's Journey - Discord Bot
 * A space dog exploration game that secretly teaches astronomy.
 */

require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const game = require("./lib/game");
const { PLANETS } = require("./data/planets");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ===== Slash Command Definitions =====
const commands = [
  new SlashCommandBuilder()
    .setName("adopt")
    .setDescription("Adopt your space dog and begin the journey!")
    .addStringOption((opt) => opt.setName("name").setDescription("Name your space dog").setRequired(true)),
  new SlashCommandBuilder().setName("dog").setDescription("Check your space dog's status"),
  new SlashCommandBuilder().setName("explore").setDescription("Travel to the next planet"),
  new SlashCommandBuilder().setName("challenge").setDescription("Answer an astronomy challenge"),
  new SlashCommandBuilder().setName("feed").setDescription("Feed your space dog to restore energy"),
  new SlashCommandBuilder().setName("play").setDescription("Play with your space dog to boost happiness"),
  new SlashCommandBuilder().setName("journal").setDescription("View your discovery journal"),
  new SlashCommandBuilder().setName("leaderboard").setDescription("View server exploration rankings"),
];

// ===== Register Commands =====
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    console.log("Registering slash commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands.map((c) => c.toJSON()),
    });
    console.log("Commands registered.");
  } catch (err) {
    console.error("Failed to register commands:", err);
  }
}

// ===== Embed Builders =====
function dogEmbed(status) {
  return new EmbedBuilder()
    .setColor(status.currentPlanet.color)
    .setTitle(`${status.emoji} ${status.name}`)
    .setDescription(`Currently at **${status.currentPlanet.name}** ${status.currentPlanet.emoji}`)
    .addFields(
      { name: "Mood", value: status.mood, inline: true },
      { name: "Energy", value: `\`${status.energyBar}\` ${status.energy}%`, inline: true },
      { name: "Happiness", value: `${"❤️".repeat(Math.ceil(status.happiness / 20))} ${status.happiness}%`, inline: true },
      { name: "XP", value: `${status.xp} XP`, inline: true },
      { name: "Rank", value: status.rank, inline: true },
      { name: "Planets Explored", value: `${status.planetsExplored}/${PLANETS.length - 1}`, inline: true },
      { name: "Challenges", value: `${status.challengesCorrect}/${status.challengesTotal} correct`, inline: true }
    )
    .setFooter({ text: "Laika's Journey — secretly learning astronomy 🌟" });
}

function exploreEmbed(result) {
  return new EmbedBuilder()
    .setColor(result.planet.color)
    .setTitle(`${result.planet.emoji} Arrived at ${result.planet.name}!`)
    .setDescription(result.planet.description)
    .addFields(
      { name: "🔭 Discovery", value: result.fact },
      { name: "XP Gained", value: `+${result.xpGained} XP (Total: ${result.newXP})`, inline: true }
    )
    .setFooter({ text: "Use /challenge to test your knowledge about this planet!" });
}

// ===== Command Handlers =====
client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    await handleCommand(interaction);
  } else if (interaction.isButton()) {
    await handleButton(interaction);
  }
});

async function handleCommand(interaction) {
  const { commandName, user, guildId } = interaction;

  switch (commandName) {
    case "adopt": {
      const dogName = interaction.options.getString("name");
      const result = game.adoptDog(user.id, guildId, dogName);
      if (result.success) {
        const embed = new EmbedBuilder()
          .setColor(0x00dd88)
          .setTitle("🐕 Space Dog Adopted!")
          .setDescription(result.message)
          .setFooter({ text: "Use /explore to begin your journey!" });
        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply({ content: result.reason, ephemeral: true });
      }
      break;
    }

    case "dog": {
      const status = game.getDogStatus(user.id);
      if (!status) {
        await interaction.reply({ content: "You don't have a space dog yet! Use `/adopt` first.", ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [dogEmbed(status)] });
      break;
    }

    case "explore": {
      const result = game.explore(user.id);
      if (!result.success) {
        await interaction.reply({ content: result.reason, ephemeral: true });
        return;
      }
      await interaction.reply({ embeds: [exploreEmbed(result)] });
      break;
    }

    case "challenge": {
      const result = game.getChallenge(user.id);
      if (!result.success) {
        await interaction.reply({ content: result.reason, ephemeral: true });
        return;
      }

      const { planet, challenge } = result;
      const embed = new EmbedBuilder()
        .setColor(planet.color)
        .setTitle(`${planet.emoji} ${planet.name} Challenge`)
        .setDescription(`**${challenge.q}**`);

      const row = new ActionRowBuilder();
      challenge.options.forEach((opt, i) => {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`answer_${planet.id}_${encodeURIComponent(challenge.q)}_${i}`)
            .setLabel(opt)
            .setStyle(ButtonStyle.Secondary)
        );
      });

      await interaction.reply({ embeds: [embed], components: [row] });
      break;
    }

    case "feed": {
      const result = game.feedDog(user.id);
      if (!result.success) {
        await interaction.reply({ content: result.reason, ephemeral: true });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(0x44dd88)
        .setTitle("🍖 Space Kibble Deployed!")
        .setDescription(`**${result.name}** munches happily on cosmic treats!`)
        .addFields(
          { name: "Energy", value: `${result.newEnergy}%`, inline: true },
          { name: "XP", value: `+${result.xpGained}`, inline: true }
        );
      await interaction.reply({ embeds: [embed] });
      break;
    }

    case "play": {
      const result = game.playWithDog(user.id);
      if (!result.success) {
        await interaction.reply({ content: result.reason, ephemeral: true });
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(0xff88aa)
        .setTitle("🎾 Zero-G Fetch!")
        .setDescription(`**${result.name}** zooms after a floating tennis ball! 🐕💨`)
        .addFields(
          { name: "Happiness", value: `${result.newHappiness}%`, inline: true },
          { name: "XP", value: `+${result.xpGained}`, inline: true }
        );
      await interaction.reply({ embeds: [embed] });
      break;
    }

    case "journal": {
      const journal = game.getJournal(user.id);
      if (!journal) {
        await interaction.reply({ content: "You don't have a space dog yet! Use `/adopt` first.", ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xffd700)
        .setTitle(`📖 ${journal.dogName}'s Discovery Journal`)
        .setDescription(`**${journal.totalFacts}** facts discovered across the solar system`);

      for (const [planetId, facts] of Object.entries(journal.byPlanet)) {
        const planet = PLANETS.find((p) => p.id === planetId);
        if (planet) {
          embed.addFields({
            name: `${planet.emoji} ${planet.name}`,
            value: facts.map((f) => `• ${f}`).join("\n").slice(0, 1024),
          });
        }
      }

      await interaction.reply({ embeds: [embed] });
      break;
    }

    case "leaderboard": {
      const leaders = game.getLeaderboard(guildId);
      if (!leaders.length) {
        await interaction.reply({ content: "No explorers yet! Be the first with `/adopt`.", ephemeral: true });
        return;
      }

      const lines = leaders.map(
        (p, i) => `**${i + 1}.** 🐕 ${p.dog_name} — ${p.xp} XP | ${p.planets_explored} planets | ${p.challenges_correct} correct`
      );

      const embed = new EmbedBuilder()
        .setColor(0xffd700)
        .setTitle("🏆 Space Explorer Leaderboard")
        .setDescription(lines.join("\n"));

      await interaction.reply({ embeds: [embed] });
      break;
    }
  }
}

async function handleButton(interaction) {
  const [prefix, planetId, encodedQ, indexStr] = interaction.customId.split("_");
  if (prefix !== "answer") return;

  const questionText = decodeURIComponent(encodedQ);
  const selectedIndex = parseInt(indexStr, 10);

  const result = game.answerChallenge(interaction.user.id, planetId, questionText, selectedIndex);
  if (!result.success) {
    await interaction.reply({ content: result.reason, ephemeral: true });
    return;
  }

  const planet = PLANETS.find((p) => p.id === planetId);
  const color = result.correct ? 0x44dd88 : 0xff4444;
  const title = result.correct ? "✅ Correct!" : "❌ Not quite...";

  const embed = new EmbedBuilder().setColor(color).setTitle(title);

  if (result.correct) {
    embed.setDescription(`Great job! **+${result.xpGained} XP**`);
    if (result.bonusFact) {
      embed.addFields({ name: "🔭 Bonus Discovery", value: result.bonusFact });
    }
  } else {
    embed.setDescription(`The answer was **${result.correctAnswer}**.\nKeep exploring to learn more about ${planet.name}!`);
  }

  await interaction.update({ embeds: [embed], components: [] });
}

// ===== Start =====
client.once("ready", () => {
  console.log(`Laika's Journey is online as ${client.user.tag}! 🐕🚀`);
});

if (process.env.DISCORD_TOKEN) {
  registerCommands().then(() => client.login(process.env.DISCORD_TOKEN));
} else {
  console.log("No DISCORD_TOKEN found. Set it in .env to run the bot.");
  console.log("Game logic is available for testing via require('./lib/game')");
}
