import Foundation

private func L(_ s: String) -> [String] {
    s.split(separator: "\n", omittingEmptySubsequences: false).map(String.init)
}

public enum Corpus {
    public static let all: [Puzzle] = [
        // ─── ぬる怪部屋 ────────────────────────────────────
        Puzzle(
            id: "null-1", stable: .nullOrNil, language: "JavaScript",
            lines: L("""
            function loadCart() {
              const raw = localStorage.getItem("cart");
              const items = JSON.parse(raw);
              items.push({ id: 1 });
              return items;
            }
            """),
            buggyLineIndex: 2,
            wrestler: "ぬるぽ太郎",
            title: "null をそのまま使う",
            explanation: "localStorage にキーが無いと raw は null。JSON.parse(null) も null を返すので、その先で .push ができず投げる。`JSON.parse(raw) ?? []` で受け止める。"
        ),
        Puzzle(
            id: "null-2", stable: .nullOrNil, language: "Python",
            lines: L("""
            def first_user(users):
                return users[0]

            result = first_user([])
            """),
            buggyLineIndex: 1,
            wrestler: "空座蒲団",
            title: "空のリストから取り出す",
            explanation: "users が空のとき [0] で IndexError。`return users[0] if users else None` などで防ぐ。"
        ),
        Puzzle(
            id: "null-3", stable: .nullOrNil, language: "Java",
            lines: L("""
            public String displayName(User u) {
                return u.getName().toLowerCase();
            }
            """),
            buggyLineIndex: 1,
            wrestler: "無表示丸",
            title: "getter が null を返した先で連鎖",
            explanation: "u.getName() が null を返した瞬間に NullPointerException。`Optional.ofNullable(u.getName()).orElse(\"\").toLowerCase()` などで包む。"
        ),
        Puzzle(
            id: "null-4", stable: .nullOrNil, language: "Swift",
            lines: L("""
            var counts: [String: Int]?
            counts = ["apple": 3]
            let n = counts!["apple"]! + 1
            """),
            buggyLineIndex: 2,
            wrestler: "強制開封丸",
            title: "！の二段重ね",
            explanation: "オプショナルを ! で 2 回開けると、どちらかが nil の日に必ず落ちる。`counts?[\"apple\"] ?? 0` で安全に。"
        ),

        // ─── 一つ違ヰ部屋 ────────────────────────────────────
        Puzzle(
            id: "obo-1", stable: .offByOne, language: "C",
            lines: L("""
            int sum_array(int *arr, int n) {
                int s = 0;
                for (int i = 0; i <= n; i++) {
                    s += arr[i];
                }
                return s;
            }
            """),
            buggyLineIndex: 2,
            wrestler: "一寸はみ出し",
            title: "<= で末尾をひと足踏み越える",
            explanation: "i が n まで行くと arr[n] は範囲外。`< n` が正しい。"
        ),
        Puzzle(
            id: "obo-2", stable: .offByOne, language: "JavaScript",
            lines: L("""
            function lastChar(s) {
              return s.substring(s.length);
            }
            """),
            buggyLineIndex: 1,
            wrestler: "末端越え",
            title: "substring(length) で空文字",
            explanation: "length は最後の文字の次の位置。最後の 1 文字が欲しいなら `s.substring(s.length - 1)`。"
        ),
        Puzzle(
            id: "obo-3", stable: .offByOne, language: "Go",
            lines: L("""
            func last(arr []int) int {
                return arr[len(arr)]
            }
            """),
            buggyLineIndex: 1,
            wrestler: "末位の鬼",
            title: "len(arr) は範囲外",
            explanation: "len(arr) はちょうど末尾の次の位置。最後の要素は -1 を引いて `arr[len(arr)-1]`。"
        ),
        Puzzle(
            id: "obo-4", stable: .offByOne, language: "SQL",
            lines: L("""
            -- 2 ページ目を取りたい (1 ページ 10 件)
            SELECT * FROM posts
            ORDER BY created_at DESC
            LIMIT 10 OFFSET 11;
            """),
            buggyLineIndex: 3,
            wrestler: "飛び越え十一",
            title: "OFFSET の数字がひとつズレ",
            explanation: "2 ページ目は 10 件飛ばす。OFFSET = (page-1) * limit = 10。11 だと 1 件抜ける。"
        ),

        // ─── 等号部屋 ────────────────────────────────────
        Puzzle(
            id: "eq-1", stable: .equality, language: "JavaScript",
            lines: L("""
            function check(status) {
              if (status = "ok") {
                return "fine";
              }
              return "fail";
            }
            """),
            buggyLineIndex: 1,
            wrestler: "代入暴狼",
            title: "= が 1 本足りない",
            explanation: "`=` は代入で、結果は \"ok\"。truthy なので必ず if が通る。`===` で比較する。"
        ),
        Puzzle(
            id: "eq-2", stable: .equality, language: "Python",
            lines: L("""
            def add_tag(tag, tags=[]):
                tags.append(tag)
                return tags
            """),
            buggyLineIndex: 0,
            wrestler: "居座リスト",
            title: "デフォルト引数のリストが居座る",
            explanation: "[] は関数定義時に 1 度だけ作られ、呼び出しを跨いで共有される。`tags=None` にして関数内で `tags = tags or []`。"
        ),
        Puzzle(
            id: "eq-3", stable: .equality, language: "Java",
            lines: L("""
            public boolean greet(String s) {
                if (s == "hello") {
                    return true;
                }
                return false;
            }
            """),
            buggyLineIndex: 1,
            wrestler: "参照神",
            title: "String を == で比べる",
            explanation: "Java の == はオブジェクトの参照比較。文字列の中身は `s.equals(\"hello\")` で。"
        ),
        Puzzle(
            id: "eq-4", stable: .equality, language: "Go",
            lines: L("""
            func count(items map[string]int) int {
                total := 0
                for _, v := range items {
                    total += v
                }
                return items["count"]
            }
            """),
            buggyLineIndex: 5,
            wrestler: "総和すり替え",
            title: "最後の return が別物",
            explanation: "ループで合計を作っているのに、return で別の値を取り直している。`return total`。"
        ),

        // ─── 正規表現部屋 ────────────────────────────────────
        Puzzle(
            id: "re-1", stable: .regex, language: "JavaScript",
            lines: L("""
            function isAllCapsTitle(s) {
              return /^[A-Z]+/.test(s);
            }
            """),
            buggyLineIndex: 1,
            wrestler: "先頭しか見ぬ",
            title: "末尾アンカーが無い",
            explanation: "^[A-Z]+ は先頭が大文字なら通ってしまう。\"HEllo\" も真。`/^[A-Z]+$/` で末尾まで見る。"
        ),
        Puzzle(
            id: "re-2", stable: .regex, language: "Python",
            lines: L("""
            import re
            def is_phone(s):
                return re.match(r"\\d{3}-\\d{4}", s) is not None
            """),
            buggyLineIndex: 2,
            wrestler: "半端アンカー",
            title: "match は末尾を確認しない",
            explanation: "re.match は先頭からの照合。\"123-45670extra\" でも真になる。`re.fullmatch` を使う。"
        ),
        Puzzle(
            id: "re-3", stable: .regex, language: "Bash",
            lines: L("""
            #!/bin/bash
            read -p "input> " x
            if [[ $x =~ . ]]; then
              echo "OK"
            fi
            """),
            buggyLineIndex: 2,
            wrestler: "点食い狸",
            title: ". の罠でなんでも通す",
            explanation: "正規表現の . は改行以外の何にでも当たる。空白 1 つでも『OK』。`[[ -n \"$x\" && $x =~ [[:graph:]] ]]` などで。"
        ),
        Puzzle(
            id: "re-4", stable: .regex, language: "Python",
            lines: L("""
            import re
            def to_ints(s):
                return re.findall(r"(\\d+)", s)
            """),
            buggyLineIndex: 2,
            wrestler: "文字数の鬼",
            title: "findall は文字列を返す",
            explanation: "(\\d+) でキャプチャしても返り値は str のリスト。`return [int(x) for x in re.findall(...)]`。"
        ),

        // ─── 並行ノ宿 ────────────────────────────────────
        Puzzle(
            id: "co-1", stable: .concurrency, language: "JavaScript",
            lines: L("""
            for (var i = 0; i < 5; i++) {
              setTimeout(() => console.log(i), 0);
            }
            """),
            buggyLineIndex: 0,
            wrestler: "var 居着き",
            title: "var が捕まえる i は 1 つ",
            explanation: "var は関数スコープなのでループの全コールバックが同じ i を見る。実行時には i は 5 になっている。`let` に変える。"
        ),
        Puzzle(
            id: "co-2", stable: .concurrency, language: "Go",
            lines: L("""
            for _, v := range items {
                go func() {
                    use(v)
                }()
            }
            """),
            buggyLineIndex: 1,
            wrestler: "同名 v すり替え",
            title: "ループ変数を捕まえる",
            explanation: "Go 1.22 未満では range の v は使い回される変数。クロージャは皆同じ v を見る。`go func(v int){use(v)}(v)` と引数で渡す。"
        ),
        Puzzle(
            id: "co-3", stable: .concurrency, language: "JavaScript",
            lines: L("""
            const results = [];
            arr.forEach(async (item) => {
              const r = await fetch(item.url);
              results.push(await r.json());
            });
            console.log(results);
            """),
            buggyLineIndex: 1,
            wrestler: "素通り forEach",
            title: "forEach が await を待たない",
            explanation: "forEach は async コールバックの Promise を捨てる。`await Promise.all(arr.map(async ...))` で待つ。"
        ),
        Puzzle(
            id: "co-4", stable: .concurrency, language: "Java",
            lines: L("""
            List<String> log = new ArrayList<>();
            ExecutorService es = Executors.newFixedThreadPool(8);
            for (int i = 0; i < 1000; i++) {
                es.submit(() -> log.add("hi"));
            }
            """),
            buggyLineIndex: 0,
            wrestler: "並走貝",
            title: "ArrayList を共有する",
            explanation: "ArrayList はスレッドセーフではない。並列 add で内部配列が壊れる。`Collections.synchronizedList(...)` か `CopyOnWriteArrayList`。"
        ),

        // ─── 罠ノ型部屋 ────────────────────────────────────
        Puzzle(
            id: "ty-1", stable: .typing, language: "JavaScript",
            lines: L("""
            const nums = [10, 1, 100, 2];
            const sorted = nums.sort();
            console.log(sorted);
            """),
            buggyLineIndex: 1,
            wrestler: "文字でなで斬り",
            title: "sort のデフォルトは文字比較",
            explanation: "JS の Array.sort は要素を文字列に変換して比較。出力は [1, 10, 100, 2]。`(a,b)=>a-b` を渡す。"
        ),
        Puzzle(
            id: "ty-2", stable: .typing, language: "Python",
            lines: L("""
            x = 1
            def update():
                x = x + 1
            update()
            """),
            buggyLineIndex: 2,
            wrestler: "影武者 x",
            title: "global 無しで x を更新",
            explanation: "関数内で代入があると Python は『これはローカル』と決める。右辺で読もうとして UnboundLocalError。先頭に `global x`。"
        ),
        Puzzle(
            id: "ty-3", stable: .typing, language: "JavaScript",
            lines: L("""
            const v = JSON.parse(input);
            if (typeof v === "object") {
              for (const k of Object.keys(v)) handle(k);
            }
            """),
            buggyLineIndex: 1,
            wrestler: "空オブジェ",
            title: "typeof null は object",
            explanation: "null も typeof で『object』。Object.keys(null) は投げる。`v !== null && typeof v === 'object'` でガード。"
        ),
        Puzzle(
            id: "ty-4", stable: .typing, language: "Swift",
            lines: L("""
            let raw = "42"
            let n: Int = raw
            print(n + 1)
            """),
            buggyLineIndex: 1,
            wrestler: "型変わらず",
            title: "Swift は String を Int に自動変換しない",
            explanation: "Swift は暗黙の型変換を許さない。`let n = Int(raw) ?? 0` で受け取る。"
        ),
    ]

    public static func byStable(_ s: Stable) -> [Puzzle] {
        all.filter { $0.stable == s }
    }
}
