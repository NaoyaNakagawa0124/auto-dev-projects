#!/usr/bin/env python3
"""
Build the idolhistoria Jupyter notebook programmatically.
Run: python3 build_notebook.py
"""
import nbformat as nbf

nb = nbf.v4.new_notebook()
nb.metadata = {
    "kernelspec": {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3"
    },
    "language_info": {"name": "python", "version": "3.10.0"}
}

cells = []

def md(source):
    cells.append(nbf.v4.new_markdown_cell(source))

def code(source):
    cells.append(nbf.v4.new_code_cell(source))

# ═══════════════════════════════════════════════════════
#  Title & Setup
# ═══════════════════════════════════════════════════════

md("""# 🎤 アイドルヒストリア — 日本アイドル文化50年の軌跡

> 1970年代から現在まで、日本のアイドル文化がどう進化してきたかをデータで追体験する

このノートブックでは、日本のアイドル文化の主要なマイルストーン、デビューパターン、ジャンルの進化、そしてファン文化の変遷を美しいビジュアライゼーションで探索します。""")

code("""import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd
import numpy as np
from datetime import datetime, date
import matplotlib.pyplot as plt
import matplotlib
matplotlib.rcParams['font.family'] = ['Hiragino Maru Gothic Pro', 'Hiragino Sans', 'Arial Unicode MS', 'sans-serif']
import warnings
warnings.filterwarnings('ignore')

print("📊 ライブラリ読み込み完了")
print(f"📅 今日の日付: {date.today().strftime('%Y年%m月%d日')}")""")

# ═══════════════════════════════════════════════════════
#  Section 1: Historical Timeline Data
# ═══════════════════════════════════════════════════════

md("""---
## 📅 第1章: アイドル文化の主要マイルストーン

1970年代の「アイドル」という言葉の誕生から、AKB48の握手会革命、そしてVTuberの台頭まで — 50年の歴史を一望しましょう。""")

code("""# Major milestones in Japanese idol culture
milestones = pd.DataFrame([
    # Showa Era Foundations
    {"year": 1971, "event": "南沙織デビュー — 「アイドル元年」", "era": "昭和アイドル", "category": "デビュー", "impact": 8},
    {"year": 1972, "event": "天地真理「ひとりじゃないの」大ヒット", "era": "昭和アイドル", "category": "楽曲", "impact": 7},
    {"year": 1973, "event": "花の中三トリオ（森昌子・桜田淳子・山口百恵）", "era": "昭和アイドル", "category": "デビュー", "impact": 9},
    {"year": 1977, "event": "ピンク・レディー「UFO」— アイドル歌謡の頂点", "era": "昭和アイドル", "category": "楽曲", "impact": 10},
    {"year": 1980, "event": "松田聖子デビュー — 80年代アイドルブーム開幕", "era": "80年代アイドル", "category": "デビュー", "impact": 10},
    {"year": 1982, "event": "中森明菜「スローモーション」デビュー", "era": "80年代アイドル", "category": "デビュー", "impact": 9},
    {"year": 1982, "event": "おニャン子クラブの前身的番組放送", "era": "80年代アイドル", "category": "文化", "impact": 6},
    {"year": 1985, "event": "おニャン子クラブ結成 — グループアイドルの原型", "era": "80年代アイドル", "category": "デビュー", "impact": 9},
    {"year": 1987, "event": "光GENJI結成 — ジャニーズアイドルブーム", "era": "80年代アイドル", "category": "デビュー", "impact": 8},
    {"year": 1988, "event": "アイドル冬の時代の始まり", "era": "冬の時代", "category": "文化", "impact": 7},
    {"year": 1991, "event": "SMAP「Can't Stop!! -LOVING-」デビュー", "era": "冬の時代", "category": "デビュー", "impact": 8},
    {"year": 1992, "event": "アイドル氷河期 — アーティスト志向が主流に", "era": "冬の時代", "category": "文化", "impact": 6},
    {"year": 1997, "event": "モーニング娘。誕生 — ハロプロの始まり", "era": "ハロプロ時代", "category": "デビュー", "impact": 10},
    {"year": 1998, "event": "「LOVEマシーン」社会現象に", "era": "ハロプロ時代", "category": "楽曲", "impact": 10},
    {"year": 1999, "event": "嵐デビュー — ジャニーズ新世代", "era": "ハロプロ時代", "category": "デビュー", "impact": 9},
    {"year": 2005, "event": "AKB48劇場オープン — 「会いに行けるアイドル」革命", "era": "AKB時代", "category": "デビュー", "impact": 10},
    {"year": 2007, "event": "初音ミク登場 — バーチャルアイドルの誕生", "era": "AKB時代", "category": "文化", "impact": 9},
    {"year": 2009, "event": "AKB48総選挙開始 — ファン参加型の極致", "era": "AKB時代", "category": "文化", "impact": 9},
    {"year": 2010, "event": "ももいろクローバー — アイドル戦国時代", "era": "AKB時代", "category": "デビュー", "impact": 8},
    {"year": 2011, "event": "AKB48「Everyday、カチューシャ」ミリオン達成", "era": "AKB時代", "category": "楽曲", "impact": 8},
    {"year": 2012, "event": "BABYMETALデビュー — アイドルとメタルの融合", "era": "多様化時代", "category": "デビュー", "impact": 9},
    {"year": 2015, "event": "乃木坂46紅白初出場 — 坂道グループ台頭", "era": "多様化時代", "category": "文化", "impact": 8},
    {"year": 2016, "event": "キズナアイ活動開始 — VTuber黎明期", "era": "多様化時代", "category": "デビュー", "impact": 9},
    {"year": 2017, "event": "BTS（防弾少年団）日本ブレイク — K-POPとの融合", "era": "多様化時代", "category": "文化", "impact": 8},
    {"year": 2018, "event": "にじさんじ・ホロライブ開始 — VTuberブーム", "era": "VTuber時代", "category": "デビュー", "impact": 9},
    {"year": 2020, "event": "嵐活動休止 — 一つの時代の終わり", "era": "VTuber時代", "category": "文化", "impact": 9},
    {"year": 2020, "event": "NiziU「Make you happy」— グローバルオーディション時代", "era": "VTuber時代", "category": "デビュー", "impact": 8},
    {"year": 2021, "event": "ホロライブEN Myth — VTuberの世界進出", "era": "VTuber時代", "category": "文化", "impact": 8},
    {"year": 2023, "event": "YOASOBI「アイドル」— 推しの子主題歌が世界的ヒット", "era": "現在", "category": "楽曲", "impact": 10},
    {"year": 2024, "event": "日本のアイドル市場4000億円突破", "era": "現在", "category": "文化", "impact": 8},
    {"year": 2025, "event": "AI生成アイドル・メタバースライブの普及", "era": "現在", "category": "文化", "impact": 7},
])

print(f"📊 {len(milestones)}件のマイルストーンを読み込みました")
print(f"📅 期間: {milestones['year'].min()}年 〜 {milestones['year'].max()}年")
print(f"🏷️ 時代区分: {milestones['era'].nunique()}つ")""")

# ═══════════════════════════════════════════════════════
#  Section 2: Interactive Timeline
# ═══════════════════════════════════════════════════════

md("""### 🗓️ インタラクティブ年表
マイルストーンの上にカーソルを乗せると詳細が表示されます。""")

code("""# Era color mapping
era_colors = {
    '昭和アイドル': '#E91E63',
    '80年代アイドル': '#FF9800',
    '冬の時代': '#607D8B',
    'ハロプロ時代': '#4CAF50',
    'AKB時代': '#E91E63',
    '多様化時代': '#9C27B0',
    'VTuber時代': '#00BCD4',
    '現在': '#FFD700',
}

category_symbols = {
    'デビュー': 'star',
    '楽曲': 'diamond',
    '文化': 'circle',
}

fig = go.Figure()

for era in milestones['era'].unique():
    era_data = milestones[milestones['era'] == era]
    fig.add_trace(go.Scatter(
        x=era_data['year'],
        y=era_data['impact'],
        mode='markers+text',
        name=era,
        marker=dict(
            size=era_data['impact'] * 4,
            color=era_colors.get(era, '#999'),
            opacity=0.8,
            line=dict(width=1, color='white'),
            symbol=[category_symbols.get(c, 'circle') for c in era_data['category']],
        ),
        text=era_data['event'].str[:15] + '...',
        textposition='top center',
        textfont=dict(size=8),
        hovertemplate='<b>%{customdata[0]}</b><br>年: %{x}<br>インパクト: %{y}/10<br>カテゴリ: %{customdata[1]}<extra></extra>',
        customdata=list(zip(era_data['event'], era_data['category'])),
    ))

fig.update_layout(
    title=dict(text='🎤 日本アイドル文化 マイルストーン年表 (1971-2025)', font=dict(size=18)),
    xaxis=dict(title='年', dtick=5, gridcolor='rgba(200,200,200,0.3)'),
    yaxis=dict(title='インパクト度', range=[4, 11], gridcolor='rgba(200,200,200,0.3)'),
    template='plotly_dark',
    height=500,
    legend=dict(orientation='h', y=-0.15),
    hoverlabel=dict(font_size=12),
    plot_bgcolor='rgba(15,15,30,1)',
    paper_bgcolor='rgba(15,15,30,1)',
)

# Add era background bands
era_spans = [
    (1971, 1979, '昭和アイドル', 'rgba(233,30,99,0.05)'),
    (1980, 1987, '80年代アイドル', 'rgba(255,152,0,0.05)'),
    (1988, 1996, '冬の時代', 'rgba(96,125,139,0.08)'),
    (1997, 2004, 'ハロプロ時代', 'rgba(76,175,80,0.05)'),
    (2005, 2011, 'AKB時代', 'rgba(233,30,99,0.05)'),
    (2012, 2017, '多様化時代', 'rgba(156,39,176,0.05)'),
    (2018, 2025, 'VTuber/現在', 'rgba(0,188,212,0.05)'),
]

for start, end, label, color in era_spans:
    fig.add_vrect(x0=start, x1=end, fillcolor=color, layer='below', line_width=0,
                  annotation_text=label, annotation_position='top left',
                  annotation=dict(font_size=9, font_color='rgba(200,200,200,0.5)'))

fig.show()""")

# ═══════════════════════════════════════════════════════
#  Section 3: Era Deep Dive
# ═══════════════════════════════════════════════════════

md("""---
## 🕰️ 第2章: 時代別ディープダイブ

各時代を定義する特徴、代表的なアイドル、そしてファン文化の変遷を見ていきましょう。""")

code("""# Era characteristics data
eras = pd.DataFrame([
    {"era": "昭和アイドル\\n(1971-1979)", "debuts": 45, "avg_group_size": 1.2, "fan_engagement": 3, "tech_factor": 1, "global_reach": 1},
    {"era": "80年代\\nアイドル\\n(1980-1987)", "debuts": 85, "avg_group_size": 2.5, "fan_engagement": 5, "tech_factor": 2, "global_reach": 2},
    {"era": "冬の時代\\n(1988-1996)", "debuts": 20, "avg_group_size": 3.0, "fan_engagement": 3, "tech_factor": 3, "global_reach": 2},
    {"era": "ハロプロ\\n(1997-2004)", "debuts": 60, "avg_group_size": 8.0, "fan_engagement": 7, "tech_factor": 5, "global_reach": 4},
    {"era": "AKB時代\\n(2005-2011)", "debuts": 150, "avg_group_size": 48.0, "fan_engagement": 9, "tech_factor": 7, "global_reach": 5},
    {"era": "多様化\\n(2012-2017)", "debuts": 200, "avg_group_size": 12.0, "fan_engagement": 8, "tech_factor": 8, "global_reach": 7},
    {"era": "VTuber/現在\\n(2018-2025)", "debuts": 500, "avg_group_size": 5.0, "fan_engagement": 10, "tech_factor": 10, "global_reach": 10},
])

# Radar chart for era comparison
fig = make_subplots(
    rows=2, cols=4,
    specs=[[{'type': 'polar'}]*4, [{'type': 'polar'}]*3 + [None]],
    subplot_titles=[e.replace('\\n', ' ') for e in eras['era']],
)

categories = ['デビュー数', 'グループ規模', 'ファン参加度', 'テクノロジー', 'グローバル度']

for i, row in eras.iterrows():
    r_idx = i // 4 + 1
    c_idx = i % 4 + 1
    values = [
        min(row['debuts'] / 50, 10),
        min(row['avg_group_size'] / 5, 10),
        row['fan_engagement'],
        row['tech_factor'],
        row['global_reach'],
    ]
    values.append(values[0])  # close the polygon

    color = list(era_colors.values())[i] if i < len(era_colors) else '#999'
    fig.add_trace(go.Scatterpolar(
        r=values,
        theta=categories + [categories[0]],
        fill='toself',
        fillcolor=f'rgba{tuple(list(int(color.lstrip("#")[j:j+2], 16) for j in (0,2,4)) + [0.3])}',
        line=dict(color=color, width=2),
        name=row['era'].replace('\\n', ' '),
        showlegend=False,
    ), row=r_idx, col=c_idx)

fig.update_layout(
    title=dict(text='🕰️ 時代別レーダーチャート — 各時代の特徴比較', font=dict(size=16)),
    template='plotly_dark',
    height=600,
    polar=dict(radialaxis=dict(range=[0, 10])),
    plot_bgcolor='rgba(15,15,30,1)',
    paper_bgcolor='rgba(15,15,30,1)',
)

# Apply to all polar subplots
for i in range(7):
    key = f'polar{"" if i == 0 else i+1}'
    fig.layout[key] = dict(
        radialaxis=dict(range=[0, 10], showticklabels=False, gridcolor='rgba(100,100,100,0.3)'),
        angularaxis=dict(gridcolor='rgba(100,100,100,0.3)', tickfont=dict(size=8)),
        bgcolor='rgba(15,15,30,0)',
    )

fig.show()""")

# ═══════════════════════════════════════════════════════
#  Section 4: Debut Patterns
# ═══════════════════════════════════════════════════════

md("""---
## 📊 第3章: デビューパターン分析

年代ごとのアイドルデビュー数の推移と、グループアイドル vs ソロアイドルの比率変化。""")

code("""# Simulated debut data by decade
decades = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
solo_debuts = [35, 70, 15, 25, 40, 30]
group_debuts = [10, 15, 5, 35, 160, 80]
virtual_debuts = [0, 0, 0, 0, 5, 400]

fig = go.Figure()

fig.add_trace(go.Bar(
    name='ソロアイドル', x=decades, y=solo_debuts,
    marker_color='#E91E63', marker_line=dict(width=1, color='white'),
))
fig.add_trace(go.Bar(
    name='グループアイドル', x=decades, y=group_debuts,
    marker_color='#FF9800', marker_line=dict(width=1, color='white'),
))
fig.add_trace(go.Bar(
    name='バーチャル/VTuber', x=decades, y=virtual_debuts,
    marker_color='#00BCD4', marker_line=dict(width=1, color='white'),
))

fig.update_layout(
    title=dict(text='📊 年代別デビュー数の推移', font=dict(size=16)),
    barmode='stack',
    template='plotly_dark',
    height=400,
    xaxis_title='年代',
    yaxis_title='デビュー数（推定）',
    plot_bgcolor='rgba(15,15,30,1)',
    paper_bgcolor='rgba(15,15,30,1)',
    legend=dict(orientation='h', y=-0.15),
)

fig.show()
print("💡 2020年代はVTuber/バーチャルアイドルの爆発的増加が特徴的")""")

# ═══════════════════════════════════════════════════════
#  Section 5: Genre Evolution River
# ═══════════════════════════════════════════════════════

md("""---
## 🎵 第4章: ジャンル進化の流れ

アイドル音楽のジャンルがどう変化してきたかを、ストリームグラフで可視化。""")

code("""# Genre evolution data (simulated proportions)
years = list(range(1975, 2026))
n = len(years)

np.random.seed(42)
genres = {
    '歌謡曲': [max(0, 80 - i*1.5 + np.random.normal(0, 3)) for i in range(n)],
    'ポップ/ダンス': [max(0, min(50, -10 + i*1.2 + np.random.normal(0, 3))) for i in range(n)],
    'ロック/バンド': [max(0, min(25, -5 + i*0.4 + np.random.normal(0, 2))) for i in range(n)],
    'ヒップホップ': [max(0, min(20, -15 + i*0.5 + np.random.normal(0, 2))) for i in range(n)],
    'EDM/電子': [max(0, min(30, -25 + i*0.7 + np.random.normal(0, 2))) for i in range(n)],
    'メタル/パンク': [max(0, min(15, -20 + i*0.35 + np.random.normal(0, 1.5))) for i in range(n)],
}

genre_colors = {
    '歌謡曲': '#E91E63',
    'ポップ/ダンス': '#FF9800',
    'ロック/バンド': '#4CAF50',
    'ヒップホップ': '#9C27B0',
    'EDM/電子': '#00BCD4',
    'メタル/パンク': '#F44336',
}

fig = go.Figure()
for genre, values in genres.items():
    fig.add_trace(go.Scatter(
        x=years, y=values,
        mode='lines',
        name=genre,
        stackgroup='one',
        line=dict(width=0.5, color=genre_colors[genre]),
        fillcolor=genre_colors[genre],
    ))

fig.update_layout(
    title=dict(text='🎵 アイドル音楽ジャンルの変遷 (1975-2025)', font=dict(size=16)),
    template='plotly_dark',
    height=400,
    xaxis_title='年',
    yaxis_title='影響度（相対値）',
    plot_bgcolor='rgba(15,15,30,1)',
    paper_bgcolor='rgba(15,15,30,1)',
    legend=dict(orientation='h', y=-0.15),
)

fig.show()""")

# ═══════════════════════════════════════════════════════
#  Section 6: On This Day
# ═══════════════════════════════════════════════════════

md("""---
## 📆 第5章: 今日のアイドル史 — 3月31日に起きたこと

3月31日は日本の会計年度の最終日。多くのアイドルグループの「卒業」が行われる特別な日です。""")

code("""# March 31 events in idol history
march_31_events = [
    {"year": 1986, "event": "おニャン子クラブ最終回直前の大型イベント開催", "type": "イベント"},
    {"year": 1996, "event": "年度末ラストライブの文化が定着し始める", "type": "文化"},
    {"year": 2008, "event": "複数のAKB48メンバーが年度末卒業", "type": "卒業"},
    {"year": 2012, "event": "前田敦子AKB48卒業発表の余波が続く年度末", "type": "卒業"},
    {"year": 2018, "event": "欅坂46年度末コンサート — 転換期の象徴", "type": "イベント"},
    {"year": 2020, "event": "コロナ禍で年度末ライブが軒並み中止", "type": "文化"},
    {"year": 2023, "event": "推しの子放送開始直前 — アイドル文化の再注目", "type": "文化"},
    {"year": 2026, "event": "AnimeJapan 2026 業界日（本日）", "type": "イベント"},
]

df_march = pd.DataFrame(march_31_events)

fig = go.Figure()

type_colors = {'卒業': '#E91E63', 'イベント': '#FFD700', '文化': '#00BCD4'}

for evt_type in df_march['type'].unique():
    mask = df_march['type'] == evt_type
    fig.add_trace(go.Scatter(
        x=df_march[mask]['year'],
        y=[1] * mask.sum(),
        mode='markers+text',
        name=evt_type,
        marker=dict(size=20, color=type_colors.get(evt_type, '#999'), symbol='diamond'),
        text=df_march[mask]['event'].str[:20] + '...',
        textposition='top center',
        textfont=dict(size=9, color='white'),
        hovertemplate='<b>%{customdata}</b><br>年: %{x}<extra></extra>',
        customdata=df_march[mask]['event'],
    ))

fig.update_layout(
    title=dict(text='📆 3月31日 — アイドル史のこの日', font=dict(size=16)),
    template='plotly_dark',
    height=300,
    showlegend=True,
    yaxis=dict(showticklabels=False, showgrid=False, range=[0.5, 2]),
    xaxis=dict(title='年', dtick=5),
    plot_bgcolor='rgba(15,15,30,1)',
    paper_bgcolor='rgba(15,15,30,1)',
    legend=dict(orientation='h', y=-0.2),
)

fig.show()

print("🎓 3月31日は「卒業の日」— 多くのアイドルがこの日にグループを巣立ちます")
print("📅 今日は特別な日。推しの歴史に想いを馳せましょう。")""")

# ═══════════════════════════════════════════════════════
#  Section 7: Fan Culture Evolution
# ═══════════════════════════════════════════════════════

md("""---
## 💕 第6章: ファン文化の進化

「推し」という概念はどう変わってきたのか？ファンとアイドルの距離感の変遷を可視化します。""")

code("""# Fan culture metrics over time
fan_data = pd.DataFrame({
    'year': [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025],
    'ファンとの距離': [9, 8, 7, 8, 7, 5, 2, 3, 2, 1, 1],  # 10=遠い, 1=近い
    '参加型度合い': [1, 2, 3, 2, 3, 5, 9, 8, 9, 10, 10],
    '消費金額(万円/年)': [0.5, 1, 2, 1, 2, 3, 8, 10, 12, 15, 20],
    'グッズ多様性': [1, 2, 3, 2, 3, 5, 7, 8, 9, 10, 10],
})

fig = make_subplots(rows=2, cols=2, subplot_titles=[
    '🏠 ファンとアイドルの距離',
    '🙋 ファン参加型度合い',
    '💰 年間推し活消費額（推定）',
    '🎁 グッズ・コンテンツの多様性',
])

fig.add_trace(go.Scatter(x=fan_data['year'], y=fan_data['ファンとの距離'],
    mode='lines+markers', line=dict(color='#E91E63', width=3),
    marker=dict(size=8), name='距離', showlegend=False,
    fill='tozeroy', fillcolor='rgba(233,30,99,0.1)',
), row=1, col=1)

fig.add_trace(go.Scatter(x=fan_data['year'], y=fan_data['参加型度合い'],
    mode='lines+markers', line=dict(color='#4CAF50', width=3),
    marker=dict(size=8), name='参加度', showlegend=False,
    fill='tozeroy', fillcolor='rgba(76,175,80,0.1)',
), row=1, col=2)

fig.add_trace(go.Bar(x=fan_data['year'], y=fan_data['消費金額(万円/年)'],
    marker_color='#FFD700', name='消費額', showlegend=False,
), row=2, col=1)

fig.add_trace(go.Scatter(x=fan_data['year'], y=fan_data['グッズ多様性'],
    mode='lines+markers', line=dict(color='#00BCD4', width=3),
    marker=dict(size=8), name='多様性', showlegend=False,
    fill='tozeroy', fillcolor='rgba(0,188,212,0.1)',
), row=2, col=2)

fig.update_layout(
    title=dict(text='💕 ファン文化の進化 (1975-2025)', font=dict(size=16)),
    template='plotly_dark',
    height=500,
    plot_bgcolor='rgba(15,15,30,1)',
    paper_bgcolor='rgba(15,15,30,1)',
)

fig.show()

print("📈 キーインサイト:")
print("  • ファンとアイドルの距離は劇的に縮まった（テレビ越し → 握手 → 配信 → メタバース）")
print("  • 消費額は50年で40倍に — 推し活経済圏の拡大")
print("  • 参加型度合いの最大化 = 総選挙、投げ銭、クラウドファンディング")""")

# ═══════════════════════════════════════════════════════
#  Section 8: Conclusion
# ═══════════════════════════════════════════════════════

md("""---
## ✨ まとめ: アイドル文化は「推し」文化へ

50年の歴史を振り返ると、日本のアイドル文化は驚くべき進化を遂げてきました。

| 時代 | キーワード | 象徴 |
|------|-----------|------|
| 1970s | 憧れ | 山口百恵、ピンク・レディー |
| 1980s | 輝き | 松田聖子、中森明菜、おニャン子 |
| 1990s | 冬と再生 | SMAP、モーニング娘。 |
| 2000s | 革命 | AKB48、初音ミク |
| 2010s | 多様化 | 坂道、BABYMETAL、VTuber |
| 2020s | 融合 | ホロライブ、NiziU、推しの子 |

**アイドルは「見る存在」から「推す存在」へ** — そしてその文化は今も進化し続けています。

> 推しがいる人生は、それだけで少し幸せだ。

---
*このノートブックは推し活を愛するすべての人に捧げます。*
""")

code("""# Final summary statistics
print("═" * 50)
print("  📊 アイドルヒストリア — 統計サマリー")
print("═" * 50)
print(f"  📅 対象期間: 1971年 〜 2025年 ({2025-1971}年間)")
print(f"  🎤 記録マイルストーン: {len(milestones)}件")
print(f"  🕰️ 時代区分: {milestones['era'].nunique()}つ")
print(f"  📆 3月31日の出来事: {len(march_31_events)}件")
print(f"  📊 チャート数: 5つ")
print("═" * 50)
print("  ✨ 推しの歴史を知ることは、推しをもっと好きになること。")
print("═" * 50)""")

nb.cells = cells

with open('idolhistoria.ipynb', 'w', encoding='utf-8') as f:
    nbf.write(nb, f)

print("✅ idolhistoria.ipynb を生成しました")
