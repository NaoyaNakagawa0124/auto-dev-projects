// Content script — injects the banner into Hacker News.
// chrome.storage is used so the popup can read the same state.

(async function () {
  const KEYS = {
    installedAt: "hakoake-banner:installedAt",
    visits:      "hakoake-banner:visits",
    recent:      "hakoake-banner:recent",
    hidden:      "hakoake-banner:hidden",
  };
  const MAX_RECENT = 5;

  function getAll(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (items) => resolve(items || {}));
    });
  }
  function setAll(obj) {
    return new Promise((resolve) => chrome.storage.local.set(obj, () => resolve()));
  }

  // --- pure logic (mirrors src/stats.js + src/lines.js) ---
  // Re-inlined here because content scripts cannot use ES module imports
  // without bundling. Stays in sync with src/* by structure.
  const INITIAL_BOXES = 35;
  const BOXES_PER_VISIT_FACTOR = 1.7;
  const DAY_MS = 86_400_000;

  function phaseFor(days) {
    if (days <= 6)  return "fresh";
    if (days <= 29) return "settling";
    if (days <= 89) return "stale";
    return "ghost";
  }
  function computeStats(installedAt, visits, now) {
    const daysSinceMove = Math.max(0, Math.floor((now - installedAt) / DAY_MS));
    const dailyAccrual = 0.4;
    const boxesRemaining = Math.round(
      INITIAL_BOXES + (daysSinceMove * dailyAccrual) - (visits * BOXES_PER_VISIT_FACTOR)
    );
    return { daysSinceMove, boxesRemaining, visits, phase: phaseFor(daysSinceMove), asOf: now };
  }

  // Same line bank, embedded directly (Chrome ext content scripts can't import).
  const LINES_BY_PHASE = {
    fresh: [
      "玄関 の 段ボール、 まだ そこ に います。",
      "リビング の 床 は、 段ボール 色 です。",
      "今 開けた 箱 が、 また 別 の 箱 に 戻って いきます。",
      "椅子 と して 使って いる 箱 は、 1 軍 です。",
      "ガス は 開通 しました。 心 は まだ です。",
      "シャワー の 水圧 は、 まだ 信用 して いません。",
      "新居 の 換気扇 が、 旧居 を 思い出させます。",
      "段ボール の 中 で、 季節 が 1 つ 進み ました。",
      "「とりあえず」 の 置き場 が、 5 ヶ所 増えて います。",
      "電子レンジ の 中 に、 何故 か リモコン が います。",
      "「明日 開ける」 が、 続いて います。",
      "新しい 鍵 の 重さ、 まだ 慣れません。",
    ],
    settling: [
      "ダンボール、 もう そろそろ 開けません か。",
      "1 個 だけ 開ければ、 「家」 と 呼べる かも しれません。",
      "ガムテープ の 切れ端 が、 床 に 5 枚 います。",
      "「お風呂 道具」 と 書いた 箱、 まだ 玄関 です。",
      "鍋 が ある 棚 を、 ようやく 1 つ 決め ました。",
      "リモコン と 充電器 の 置き場 を 検討 中 です。",
      "新居 の 蛇口 の 音 を、 1 度 だけ 褒めました。",
      "「あと これ だけ」 が、 4 回 リピート しています。",
      "リビング の 真ん中 の 箱 が、 ローテーブル 化 しました。",
      "近所 の コンビニ は、 もう 把握 しました。",
      "玄関 マット を、 やっと 1 枚 買い ました。",
      "段ボール を 1 個 だけ、 ベランダ に 追い やり ました。",
      "観葉植物 が、 まだ 部屋 を 「家」 と 認識 して いません。",
    ],
    stale: [
      "ダンボール が、 立派 な 家具 に なりました。",
      "「冬物」 と 書かれた 箱 が、 まだ 夏 を 過ごして います。",
      "あの 箱、 中身 を もう 忘れて います。",
      "椅子 と して 使って いる 箱 が、 沈み 始めました。",
      "段ボール 越し の 月 を、 何度 か 見上げました。",
      "「とりあえず」 が、 「とりあえず」 の まま 1 ヶ月 経ちました。",
      "未開封 の 箱 と、 共同生活 が 始まりました。",
      "段ボール、 鳴いて いません か。",
      "新居 の 床 が、 段ボール 抜き で 何 平米 か 不明 です。",
      "次 引っ越す 時 の 荷物 が、 すでに 揃って います。",
      "鍵 を、 ようやく 「うち の 鍵」 と 呼びました。",
      "玄関 の 段ボール、 もう 表札 です。",
      "クローゼット の 半分 が、 まだ 段ボール です。",
    ],
    ghost: [
      "あなた は 引っ越して いない 可能性 が あります。",
      "段ボール は、 別 の 次元 に 移って いる か も しれません。",
      "「箱」 と は、 何 の こと でし た か。",
      "新居 の 概念 が、 ゆっくり 溶けて います。",
      "鏡 の 向こう の 段ボール が、 こちら を 見ています。",
      "あの 箱 は、 もう 家 の 一部 です。",
      "あなた の 「引っ越し」 は、 永遠 に 続く プロジェクト 化 しました。",
      "段ボール 紀元 N 日目 に 到達 しました。",
      "「片付ける」 と いう 言葉 を、 1 ヶ月 発して いません。",
      "段ボール の 中 の あなた、 元気 です か。",
      "新居、 と は、 何 だった の でしょう。",
      "箱 を 開けた 記憶 が、 もう 古典 です。",
    ],
  };

  function pickLine(seed, phase) {
    const pool = LINES_BY_PHASE[phase] || LINES_BY_PHASE.fresh;
    let s = (((seed | 0) ^ 0x9e3779b1) | 0) || 0x9e3779b1;
    for (let i = 0; i < 3; i++) {
      s ^= s << 13;
      s ^= s >>> 17;
      s ^= s << 5;
    }
    return pool[((s >>> 0) % pool.length)];
  }

  // --- Build the DOM ---
  function buildBanner(stats, line) {
    const root = document.createElement("div");
    root.id = "hakoake-banner";
    root.setAttribute("role", "status");

    const icon = document.createElement("span");
    icon.className = "hbb-icon";
    icon.textContent = "📦";

    const stat = document.createElement("span");
    stat.className = "hbb-stats";
    stat.innerHTML =
      `引っ越し <span class="hbb-num">${stats.daysSinceMove}</span> 日目  ` +
      `<span class="hbb-divider">|</span>  ` +
      `箱 残り <span class="hbb-num">${stats.boxesRemaining}</span> 個`;

    const div = document.createElement("span");
    div.className = "hbb-divider";
    div.textContent = "—";

    const ln = document.createElement("span");
    ln.className = "hbb-line";
    ln.textContent = line;

    const close = document.createElement("button");
    close.className = "hbb-close";
    close.title = "今回 だけ 閉じる";
    close.textContent = "×";
    close.addEventListener("click", () => root.remove());

    root.appendChild(icon);
    root.appendChild(stat);
    root.appendChild(div);
    root.appendChild(ln);
    root.appendChild(close);
    return root;
  }

  async function run() {
    const now = Date.now();
    const cur = await getAll([KEYS.installedAt, KEYS.visits, KEYS.recent]);

    let installedAt = Number(cur[KEYS.installedAt]);
    if (!Number.isFinite(installedAt) || installedAt <= 0) {
      installedAt = now;
      await setAll({ [KEYS.installedAt]: installedAt });
    }
    const visits = Number(cur[KEYS.visits] || 0) + 1;
    const stats = computeStats(installedAt, visits, now);
    const line = pickLine(now, stats.phase);

    const recent = Array.isArray(cur[KEYS.recent]) ? cur[KEYS.recent] : [];
    recent.unshift({ at: now, text: line, days: stats.daysSinceMove, boxes: stats.boxesRemaining });
    while (recent.length > MAX_RECENT) recent.pop();

    await setAll({ [KEYS.visits]: visits, [KEYS.recent]: recent });

    const node = buildBanner(stats, line);
    document.body.insertBefore(node, document.body.firstChild);
  }

  try {
    run();
  } catch (err) {
    // Never break HN itself if something goes sideways.
    console.warn("[hakoake-banner] skipped:", err);
  }
})();
