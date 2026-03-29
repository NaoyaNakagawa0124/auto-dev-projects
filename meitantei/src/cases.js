// Case definitions - 3 mystery cases with evidence, clues, and solutions

export const cases = [
  {
    id: 'case1',
    title: '消えた内定通知',
    difficulty: '初級',
    synopsis: '就活生の田中さんが受け取ったはずの内定通知書が机の上から消えた。同じフロアにいた3人の中に犯人がいる。証拠写真を調べて真犯人を特定せよ。',
    // Procedurally drawn "scene" with clickable hotspots
    scene: {
      bg: '#1a1520',
      objects: [
        { type: 'rect', x: 100, y: 300, w: 500, h: 200, color: '#3a2a20', label: '机' },
        { type: 'rect', x: 150, y: 280, w: 120, h: 30, color: '#555', label: 'ノートPC' },
        { type: 'rect', x: 350, y: 290, w: 80, h: 20, color: '#8a7a6a', label: 'コーヒーカップ' },
        { type: 'circle', x: 520, y: 340, r: 25, color: '#223', label: 'ゴミ箱' },
        { type: 'rect', x: 50, y: 100, w: 60, h: 150, color: '#2a2a3a', label: '本棚' },
        { type: 'rect', x: 600, y: 150, w: 80, h: 100, color: '#1a2a1a', label: '観葉植物' },
      ],
    },
    clues: [
      {
        id: 'c1-fingerprint',
        name: '指紋',
        description: '机の引き出しに残された指紋。田中さんのものではない。',
        location: { x: 200, y: 380, w: 60, h: 40 },
        found: false,
      },
      {
        id: 'c1-coffee',
        name: 'コーヒーの染み',
        description: 'コーヒーカップの底に、内定通知書のインクが付着している。',
        location: { x: 350, y: 290, w: 80, h: 25 },
        found: false,
      },
      {
        id: 'c1-trash',
        name: 'シュレッダーの紙片',
        description: 'ゴミ箱の中にシュレッダーにかけられた紙片。一部に「内定」の文字。',
        location: { x: 500, y: 320, w: 50, h: 50 },
        found: false,
      },
      {
        id: 'c1-schedule',
        name: 'スケジュール帳',
        description: 'PCの横に置かれたスケジュール帳。「15:00 佐藤と面談」と書かれている。',
        location: { x: 150, y: 280, w: 120, h: 30 },
        found: false,
      },
    ],
    suspects: [
      { id: 's1', name: '佐藤先輩', description: '同じ会社に応募中。田中より面接の結果が悪かった。', emoji: '🧑‍💼' },
      { id: 's2', name: '鈴木さん', description: '総務部のアルバイト。その日は16時に退勤。', emoji: '👩‍💻' },
      { id: 's3', name: '高橋教授', description: '推薦状を書いた指導教授。当日研究室にいた。', emoji: '👨‍🏫' },
    ],
    solution: {
      culprit: 's1',
      requiredClues: ['c1-fingerprint', 'c1-coffee', 'c1-trash'],
      explanation: '佐藤先輩が犯人。内定通知書をシュレッダーにかけた。指紋が一致し、コーヒーカップで書類を移動した痕跡、そしてスケジュール帳が動機（面談時に知った情報への嫉妬）を裏付ける。',
    },
  },
  {
    id: 'case2',
    title: 'サークル棟の怪文書',
    difficulty: '中級',
    synopsis: '大学のサークル棟に脅迫的な怪文書が貼られている。文化祭の直前、犯人を見つけないとイベントが中止に。手がかりを集めて犯人を突き止めろ。',
    scene: {
      bg: '#151a20',
      objects: [
        { type: 'rect', x: 50, y: 50, w: 600, h: 400, color: '#2a2520', label: '掲示板' },
        { type: 'rect', x: 100, y: 100, w: 200, h: 150, color: '#fff8e8', label: '怪文書' },
        { type: 'rect', x: 400, y: 80, w: 150, h: 100, color: '#e8e8ff', label: 'サークルポスター' },
        { type: 'rect', x: 350, y: 250, w: 120, h: 80, color: '#f0e0d0', label: 'メモ' },
        { type: 'circle', x: 600, y: 420, r: 30, color: '#334', label: '落とし物' },
        { type: 'rect', x: 50, y: 460, w: 100, h: 30, color: '#444', label: '監視カメラ' },
      ],
    },
    clues: [
      {
        id: 'c2-paper',
        name: '特殊な紙',
        description: '怪文書は大学の印刷室でしか手に入らない紙を使用。',
        location: { x: 100, y: 100, w: 200, h: 150 },
        found: false,
      },
      {
        id: 'c2-font',
        name: 'フォントの特徴',
        description: '印刷物のフォントが古いプリンターのもの。美術部の部室にあるプリンターと一致。',
        location: { x: 130, y: 130, w: 140, h: 90 },
        found: false,
      },
      {
        id: 'c2-keychain',
        name: '落としたキーホルダー',
        description: '掲示板の下に「演劇部」と刻印されたキーホルダーが落ちていた。',
        location: { x: 580, y: 400, w: 50, h: 50 },
        found: false,
      },
      {
        id: 'c2-camera',
        name: '監視カメラ映像',
        description: '深夜2時に掲示板付近を歩く人影。服装から演劇部の衣装と判明。',
        location: { x: 50, y: 460, w: 100, h: 30 },
        found: false,
      },
      {
        id: 'c2-memo',
        name: 'メモの筆跡',
        description: '掲示板に残されたメモの筆跡が怪文書と似ている。演劇部の台本と照合可能。',
        location: { x: 350, y: 250, w: 120, h: 80 },
        found: false,
      },
    ],
    suspects: [
      { id: 's1', name: '山田（美術部長）', description: '文化祭の予算配分に不満。印刷室の鍵を持っている。', emoji: '🎨' },
      { id: 's2', name: '中村（演劇部員）', description: '文化祭で主役を外された。夜型の生活。', emoji: '🎭' },
      { id: 's3', name: '小林（学生会）', description: '文化祭の実行委員長。反対派の存在に悩んでいる。', emoji: '📋' },
      { id: 's4', name: '渡辺（清掃員）', description: '夜間清掃中にサークル棟に出入り。', emoji: '🧹' },
    ],
    solution: {
      culprit: 's2',
      requiredClues: ['c2-keychain', 'c2-camera', 'c2-memo'],
      explanation: '中村（演劇部員）が犯人。キーホルダー、監視カメラの映像、筆跡の一致が決め手。文化祭で主役を外された恨みから犯行に及んだ。美術部のプリンターを無断使用。',
    },
  },
  {
    id: 'case3',
    title: '研究データの改竄',
    difficulty: '上級',
    synopsis: '卒業研究のデータが何者かに改竄された。提出期限は明日。デジタルフォレンジクスの知識を使って犯人を特定し、元のデータを取り戻せ。',
    scene: {
      bg: '#0a1520',
      objects: [
        { type: 'rect', x: 80, y: 200, w: 540, h: 280, color: '#1a2a3a', label: '研究室の机' },
        { type: 'rect', x: 100, y: 180, w: 300, h: 200, color: '#111a2a', label: 'モニター画面' },
        { type: 'rect', x: 450, y: 220, w: 100, h: 60, color: '#2a3a4a', label: '外付けHDD' },
        { type: 'rect', x: 450, y: 320, w: 120, h: 40, color: '#3a2a2a', label: '研究ノート' },
        { type: 'circle', x: 180, y: 420, r: 20, color: '#4a3a2a', label: 'USBメモリ' },
        { type: 'rect', x: 350, y: 430, w: 80, h: 50, color: '#555', label: 'アクセスログ' },
      ],
    },
    clues: [
      {
        id: 'c3-log',
        name: 'アクセスログ',
        description: '深夜3:47にlab_user02のアカウントでファイルが変更されている。',
        location: { x: 350, y: 430, w: 80, h: 50 },
        found: false,
      },
      {
        id: 'c3-usb',
        name: 'USBメモリ',
        description: '机の下に落ちていたUSBメモリ。中にオリジナルデータのコピーがある。',
        location: { x: 160, y: 400, w: 45, h: 45 },
        found: false,
      },
      {
        id: 'c3-hdd',
        name: '外付けHDDの履歴',
        description: '外付けHDDのファイル履歴に、改竄前のバックアップが残っている。タイムスタンプ3:30。',
        location: { x: 450, y: 220, w: 100, h: 60 },
        found: false,
      },
      {
        id: 'c3-notebook',
        name: '研究ノートの書き込み',
        description: '「このままでは卒業できない」と殴り書きされたページ。筆圧が強い。',
        location: { x: 450, y: 320, w: 120, h: 40 },
        found: false,
      },
      {
        id: 'c3-screen',
        name: 'モニターの反射',
        description: 'モニターのスクリーンに「diff」コマンドの痕跡。2つのファイルを比較した形跡。',
        location: { x: 100, y: 180, w: 300, h: 200 },
        found: false,
      },
    ],
    suspects: [
      { id: 's1', name: '伊藤（同期の院生）', description: '同じ研究テーマで競争関係。lab_user02のアカウント保持者。', emoji: '🔬' },
      { id: 's2', name: '松本（後輩）', description: '研究室のサーバー管理担当。root権限あり。', emoji: '💻' },
      { id: 's3', name: '木村教授', description: '研究の方向性に不満を漏らしていた指導教員。', emoji: '👨‍🔬' },
      { id: 's4', name: '斎藤（外部研究員）', description: '共同研究者。データへのアクセス権あり。', emoji: '🧑‍🔬' },
    ],
    solution: {
      culprit: 's1',
      requiredClues: ['c3-log', 'c3-notebook', 'c3-hdd'],
      explanation: '伊藤（同期の院生）が犯人。自分のアカウント(lab_user02)でログインし深夜にデータを改竄。研究ノートの書き込みが動機を示し、HDDの履歴が犯行時刻を裏付ける。USBメモリに元データが残っていたのが救い。',
    },
  },
];

export function getCaseById(id) {
  return cases.find(c => c.id === id);
}

export function checkSolution(caseData, suspectId, foundClueIds) {
  const sol = caseData.solution;
  const correctCulprit = suspectId === sol.culprit;
  const hasRequiredClues = sol.requiredClues.every(c => foundClueIds.includes(c));
  return {
    correct: correctCulprit && hasRequiredClues,
    correctCulprit,
    hasRequiredClues,
    missingClues: sol.requiredClues.filter(c => !foundClueIds.includes(c)),
  };
}
