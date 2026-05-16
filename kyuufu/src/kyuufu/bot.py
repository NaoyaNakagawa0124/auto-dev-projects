"""Discord client wiring. Pure logic lives elsewhere — this file only
translates between discord.py and the kyuufu modules.

The module must be importable without a real DISCORD_TOKEN. We only contact
Discord when `main()` is called.
"""

from __future__ import annotations

import os
import random
import sys
from datetime import datetime, time as dtime

import discord
from discord import app_commands
from discord.ext import tasks

from .cultural import framed
from .messages import pick
from .responder import reply_for
from .scheduler import suggest_stop, tier_for_dt

INTENTS = discord.Intents.default()
INTENTS.message_content = True   # to read keyword reactions in DMs / mentions


# --- Pure helpers (testable) -------------------------------------------------

def yasumi_text(now: datetime, seed: int | None = None) -> str:
    """Compose a one-line rest message appropriate for `now`."""
    s = seed if seed is not None else int(now.timestamp())
    tier = tier_for_dt(now)
    return pick(s, tier).text


def yamedoki_text(now: datetime, within_hours: float) -> str:
    """Compose a one-line stopping-time suggestion."""
    when = suggest_stop(now, within_hours=within_hours)
    return f"{when.strftime('%H:%M')} あたり が、 ちょうど 良い 区切り です。"


def kyou_text(now: datetime) -> str:
    return framed(now.date())


# --- Bot ---------------------------------------------------------------------

class KyuufuClient(discord.Client):
    def __init__(self, *, oyasumi_time: dtime | None = None, oyasumi_channel_id: int | None = None) -> None:
        super().__init__(intents=INTENTS)
        self.tree = app_commands.CommandTree(self)
        self.oyasumi_time = oyasumi_time
        self.oyasumi_channel_id = oyasumi_channel_id
        self._last_fired_minute: tuple[int, int] | None = None
        self._register_commands()

    async def setup_hook(self) -> None:  # pragma: no cover — invoked by discord on connect
        await self.tree.sync()
        self.tick.start()

    def _register_commands(self) -> None:
        tree = self.tree

        @tree.command(name="yasumi", description="今日 は ここまで、 を そっと 押す 1 行")
        async def yasumi(interaction: discord.Interaction) -> None:
            await interaction.response.send_message(yasumi_text(datetime.now()))

        @tree.command(name="yamedoki", description="あと N 時間 で やめたい 時 の、 自然 な 区切り の 提案")
        @app_commands.describe(within_hours="あと 何 時間 で やめたい です か (1 や 2.5 など)")
        async def yamedoki(interaction: discord.Interaction, within_hours: float) -> None:
            if within_hours <= 0:
                await interaction.response.send_message("時間 は 0 より 大きい 数 を 指定 して みません か。", ephemeral=True)
                return
            await interaction.response.send_message(yamedoki_text(datetime.now(), within_hours))

        @tree.command(name="kyou", description="今日 (世界 の どこか) の 文化 イベント を 1 行")
        async def kyou(interaction: discord.Interaction) -> None:
            await interaction.response.send_message(kyou_text(datetime.now()))

        @tree.command(name="oyasumi-time", description="毎日 hh:mm に 自動 で /yasumi を このチャンネル に 投稿 させる")
        @app_commands.describe(hh_mm="hh:mm 形式、 24 時間 表記 (例: 02:00)")
        async def oyasumi_time(interaction: discord.Interaction, hh_mm: str) -> None:
            try:
                hh, mm = (int(x) for x in hh_mm.split(":"))
                t = dtime(hh, mm)
            except (ValueError, AttributeError):
                await interaction.response.send_message(
                    "hh:mm の 形 で 指定 して みません か。 例: 02:00", ephemeral=True
                )
                return
            self.oyasumi_time = t
            self.oyasumi_channel_id = interaction.channel_id
            await interaction.response.send_message(
                f"毎日 {hh:02d}:{mm:02d} に、 このチャンネル で /yasumi を 1 行 投稿 します。"
            )

    @tasks.loop(minutes=1)
    async def tick(self) -> None:  # pragma: no cover — runs only when bot is online
        if self.oyasumi_time is None or self.oyasumi_channel_id is None:
            return
        now = datetime.now()
        key = (now.hour, now.minute)
        if key != (self.oyasumi_time.hour, self.oyasumi_time.minute):
            return
        if key == self._last_fired_minute:
            return
        self._last_fired_minute = key
        channel = self.get_channel(self.oyasumi_channel_id)
        if channel is not None:
            await channel.send(yasumi_text(now))

    async def on_message(self, message: discord.Message) -> None:  # pragma: no cover — discord runtime
        if message.author == self.user:
            return
        # Only respond in DMs or when explicitly mentioned.
        mentioned = self.user is not None and self.user.mentioned_in(message)
        is_dm = isinstance(message.channel, discord.DMChannel)
        if not (mentioned or is_dm):
            return
        reply = reply_for(message.content, seed=int(datetime.now().timestamp()))
        if reply:
            await message.channel.send(reply)


def main() -> None:  # pragma: no cover — entry point, requires real token
    token = os.environ.get("DISCORD_TOKEN")
    if not token:
        print(
            "DISCORD_TOKEN が 設定 されていません。 .env.example を 参照 してください。",
            file=sys.stderr,
        )
        sys.exit(1)
    client = KyuufuClient()
    client.run(token)


if __name__ == "__main__":  # pragma: no cover
    main()
