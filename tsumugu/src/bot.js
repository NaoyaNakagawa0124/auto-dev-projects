#!/usr/bin/env node
/**
 * 紡ぐ (Tsumugu) — Discord Bot
 *
 * Usage:
 *   DISCORD_TOKEN=your_token node src/bot.js
 *
 * Slash Commands:
 *   /今日の候     — 今日の七十二候と手仕事を表示
 *   /次の候       — 次の候を表示
 *   /季節の手仕事 — 現在の季節のクラフト一覧
 *   /候を検索     — キーワード検索
 */

import { buildTodayEmbed, buildNextEmbed, buildCraftsEmbed, buildSearchEmbed } from './embeds.js';

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error('┌─────────────────────────────────────────┐');
  console.error('│ DISCORD_TOKEN が設定されていません       │');
  console.error('│                                         │');
  console.error('│ 使い方:                                 │');
  console.error('│   DISCORD_TOKEN=xxxx node src/bot.js     │');
  console.error('│                                         │');
  console.error('│ CLIモードを試す:                         │');
  console.error('│   node src/cli.js                        │');
  console.error('└─────────────────────────────────────────┘');
  process.exit(1);
}

// Dynamic import discord.js — only required when actually running bot
async function startBot() {
  let discord;
  try {
    discord = await import('discord.js');
  } catch {
    console.error('discord.js がインストールされていません。');
    console.error('実行: npm install discord.js');
    process.exit(1);
  }

  const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = discord;

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  // Register slash commands
  const commands = [
    new SlashCommandBuilder()
      .setName('今日の候')
      .setDescription('今日の七十二候と季節の手仕事を表示します'),
    new SlashCommandBuilder()
      .setName('次の候')
      .setDescription('次に来る七十二候を表示します'),
    new SlashCommandBuilder()
      .setName('季節の手仕事')
      .setDescription('現在の季節のおすすめクラフト一覧を表示します'),
    new SlashCommandBuilder()
      .setName('候を検索')
      .setDescription('キーワードで候や手仕事を検索します')
      .addStringOption(option =>
        option.setName('キーワード')
          .setDescription('検索するキーワード')
          .setRequired(true)
      ),
  ].map(cmd => cmd.toJSON());

  client.once('ready', async () => {
    console.log(`紡ぐ ログイン完了: ${client.user.tag}`);

    // Register commands globally
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
      await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );
      console.log('スラッシュコマンド登録完了');
    } catch (err) {
      console.error('コマンド登録エラー:', err);
    }
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
      switch (interaction.commandName) {
        case '今日の候': {
          const embed = buildTodayEmbed();
          await interaction.reply({ embeds: [embed] });
          break;
        }
        case '次の候': {
          const embed = buildNextEmbed();
          await interaction.reply({ embeds: [embed] });
          break;
        }
        case '季節の手仕事': {
          const embed = buildCraftsEmbed();
          await interaction.reply({ embeds: [embed] });
          break;
        }
        case '候を検索': {
          const keyword = interaction.options.getString('キーワード');
          const embed = buildSearchEmbed(keyword);
          await interaction.reply({ embeds: [embed] });
          break;
        }
        default:
          await interaction.reply({ content: '不明なコマンドです', ephemeral: true });
      }
    } catch (err) {
      console.error('コマンド実行エラー:', err);
      const reply = { content: 'エラーが発生しました。もう一度お試しください。', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  });

  await client.login(TOKEN);
}

startBot();
