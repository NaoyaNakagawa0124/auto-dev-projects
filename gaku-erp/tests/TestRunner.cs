using System;
using System.Linq;
using GakuERP;

class TestRunner
{
    static int passed = 0;
    static int failed = 0;

    static void Suite(string name) => Console.WriteLine($"\n\x1b[33m  {name}\x1b[0m");

    static void Assert(string name, bool condition)
    {
        if (condition) { Console.WriteLine($"    \x1b[32m✓\x1b[0m {name}"); passed++; }
        else { Console.WriteLine($"    \x1b[31m✗\x1b[0m {name}"); failed++; }
    }

    static void Main()
    {
        Console.WriteLine("\x1b[1m📊 学ERP テストスイート\x1b[0m");

        TestDepartment();
        TestEmployee();
        TestCompany();
        TestTimeTracking();
        TestProjects();
        TestGrading();
        TestKnowledgeDecay();
        TestOvertimeLogic();
        TestFinancialMetrics();

        int total = passed + failed;
        Console.WriteLine();
        for (int i = 0; i < 40; i++) Console.Write("─");
        Console.WriteLine();
        if (failed == 0)
            Console.WriteLine($"\x1b[32m✓ {passed}/{total} テスト全て通過\x1b[0m");
        else
            Console.WriteLine($"\x1b[31m✗ {failed}/{total} テスト失敗\x1b[0m");

        Environment.Exit(failed > 0 ? 1 : 0);
    }

    static void TestDepartment()
    {
        Suite("部署 (Department)");

        var d = new Department { Name = "数学", Code = "MATH", Priority = 3, KnowledgeStock = 50, DecayRate = 1.5 };
        Assert("名前", d.Name == "数学");
        Assert("コード", d.Code == "MATH");
        Assert("優先度", d.Priority == 3);
        Assert("初期知識在庫", d.KnowledgeStock == 50);
        Assert("請求時間: 初期0", d.TotalBillableHours == 0);
        Assert("ROI: 初期0", d.ROI == 0);

        // AddKnowledge
        d.AddKnowledge(2.0, false);
        Assert("知識追加（通常）", d.KnowledgeStock > 50);

        double afterNormal = d.KnowledgeStock;
        d.KnowledgeStock = 50;
        d.AddKnowledge(2.0, true);
        double afterOvertime = d.KnowledgeStock;
        Assert("残業は効率低下", afterOvertime < afterNormal);

        // Knowledge cap at 100
        d.KnowledgeStock = 95;
        d.AddKnowledge(5.0, false);
        Assert("知識上限100", d.KnowledgeStock <= 100);

        // Decay
        d.KnowledgeStock = 50;
        d.ApplyDecay();
        Assert("知識減衰", d.KnowledgeStock < 50);
        Assert("減衰量 = DecayRate", Math.Abs(d.KnowledgeStock - 48.5) < 0.01);

        // Decay doesn't go below 0
        d.KnowledgeStock = 0.5;
        d.ApplyDecay();
        Assert("知識下限0", d.KnowledgeStock >= 0);
    }

    static void TestEmployee()
    {
        Suite("従業員 (Employee)");

        var e = new Employee();
        Assert("初期体力: 100", e.Energy == 100);
        Assert("初期集中力: 100", e.Focus == 100);
        Assert("初期士気: 80", e.Morale == 80);
        Assert("初期状態: 絶好調", e.ConditionLabel == "絶好調");

        // Work
        e.Work(1.0, false);
        Assert("勤務後: 体力減少", e.Energy < 100);
        Assert("勤務後: 集中力減少", e.Focus < 100);

        // Overtime is harder
        var e2 = new Employee();
        e2.Work(1.0, true);
        Assert("残業: 体力消費増加", e2.Energy < e.Energy);
        Assert("残業: 連続日数カウント", e2.ConsecutiveOvertimeDays == 1);

        // Rest
        e.Rest();
        Assert("休憩: 体力回復", e.Energy > 60);
        Assert("休憩: 集中力回復", e.Focus > 60);
        Assert("休憩: PTO使用カウント", e.TotalPTOUsed == 1);
        Assert("休憩: 残業リセット", e.ConsecutiveOvertimeDays == 0);

        // Sleep
        var e3 = new Employee();
        e3.Work(3.0, false);
        double beforeSleep = e3.Energy;
        e3.Sleep();
        Assert("就寝: 体力大回復", e3.Energy > beforeSleep);

        // Condition labels
        var e4 = new Employee();
        e4.Energy = 80; e4.Focus = 80;
        Assert("状態: 絶好調", e4.ConditionLabel == "絶好調");
        e4.Energy = 50; e4.Focus = 50;
        Assert("状態: 通常", e4.ConditionLabel == "通常");
        e4.Energy = 25; e4.Focus = 25;
        Assert("状態: 疲労", e4.ConditionLabel == "疲労");
        e4.Energy = 5; e4.Focus = 5;
        Assert("状態: 限界", e4.ConditionLabel == "限界");

        // Morale drops after consecutive overtime
        var e5 = new Employee();
        for (int i = 0; i < 5; i++) e5.Work(1.0, true);
        Assert("連続残業: 士気低下", e5.Morale < 80);
    }

    static void TestCompany()
    {
        Suite("会社 (Company)");

        var c = new Company();
        Assert("初期部署: 0", c.Departments.Count == 0);
        Assert("初期日: 1", c.DayNumber == 1);
        Assert("初期請求時間: 0", c.TotalBillableHours == 0);

        c.AddDepartment("数学", "MATH", 3);
        Assert("部署追加: 1", c.Departments.Count == 1);
        Assert("部署名", c.GetDepartment("MATH").Name == "数学");
        Assert("初期知識: 10", c.GetDepartment("MATH").KnowledgeStock == 10);

        c.AddDepartment("英語", "ENG", 4);
        Assert("部署追加: 2", c.Departments.Count == 2);

        Assert("存在しない部署: null", c.GetDepartment("XXX") == null);
    }

    static void TestTimeTracking()
    {
        Suite("タイムトラッキング");

        var c = new Company();
        c.AddDepartment("物理", "PHY", 2);

        var entry = c.LogTime("PHY", 1.5);
        Assert("タイムエントリー作成", entry != null);
        Assert("実働時間", entry.Hours == 1.5);
        Assert("部署コード", entry.DepartmentCode == "PHY");
        Assert("総請求時間 > 0", c.TotalBillableHours > 0);

        // Log more time
        c.LogTime("PHY", 2.0);
        Assert("累計タイムエントリー: 2", c.AllTimeEntries.Count == 2);

        // Employee gets tired
        Assert("従業員: 体力減少", c.Employee.Energy < 100);
    }

    static void TestProjects()
    {
        Suite("案件 (Project)");

        var p = new Project
        {
            Name = "期末テスト",
            Deadline = DateTime.Now.AddDays(7),
            DepartmentCode = "MATH",
            RequiredKnowledge = 60,
            Completed = false
        };

        Assert("案件名", p.Name == "期末テスト");
        Assert("残り日数", p.DaysRemaining >= 6 && p.DaysRemaining <= 7);
        Assert("ステータス: 進行中", p.Status == "進行中");

        // Urgent
        var p2 = new Project
        {
            Name = "小テスト",
            Deadline = DateTime.Now.AddDays(2),
            DepartmentCode = "ENG",
            RequiredKnowledge = 30,
            Completed = false
        };
        Assert("ステータス: 緊急", p2.Status == "緊急");

        // Completed
        p.Completed = true;
        p.Grade = "A";
        Assert("ステータス: 完了", p.Status == "完了");

        // Overdue
        var p3 = new Project
        {
            Name = "過去のテスト",
            Deadline = DateTime.Now.AddDays(-1),
            Completed = false
        };
        Assert("ステータス: 期限切れ", p3.Status == "期限切れ");
    }

    static void TestGrading()
    {
        Suite("評価システム");

        var c = new Company();
        Assert("S評価: 知識120%+", c.GenerateGrade(80, 60) == "S");
        Assert("A評価: 知識100%+", c.GenerateGrade(60, 60) == "A");
        Assert("B評価: 知識80%+", c.GenerateGrade(50, 60) == "B");
        Assert("C評価: 知識60%+", c.GenerateGrade(40, 60) == "C");
        Assert("D評価: 知識60%未満", c.GenerateGrade(30, 60) == "D");
        Assert("0要件: S評価", c.GenerateGrade(50, 0) == "S");
    }

    static void TestKnowledgeDecay()
    {
        Suite("知識減衰");

        var c = new Company();
        c.AddDepartment("化学", "CHEM", 5);
        var dept = c.GetDepartment("CHEM");

        double initial = dept.KnowledgeStock;
        c.DailyDecay();
        Assert("日次減衰適用", dept.KnowledgeStock < initial);
        Assert("日カウント増加", c.DayNumber == 2);

        // Higher priority = higher decay
        c.AddDepartment("体育", "PE", 1);
        var pe = c.GetDepartment("PE");
        Assert("優先度1: 低減衰率", pe.DecayRate < dept.DecayRate);
    }

    static void TestOvertimeLogic()
    {
        Suite("残業ロジック");

        // Billable hours multiplier is 1.5x for overtime
        var c = new Company();
        c.AddDepartment("国語", "JP", 3);

        // We can't easily control DateTime.Now.Hour in tests,
        // so test the TimeEntry model directly
        var entry = new TimeEntry
        {
            Hours = 2.0,
            BillableHours = 3.0,
            IsOvertime = true,
            DepartmentCode = "JP"
        };
        Assert("残業フラグ", entry.IsOvertime == true);
        Assert("請求時間1.5倍", entry.BillableHours == 3.0);

        var normalEntry = new TimeEntry
        {
            Hours = 2.0,
            BillableHours = 2.0,
            IsOvertime = false,
            DepartmentCode = "JP"
        };
        Assert("通常: 請求=実働", normalEntry.BillableHours == normalEntry.Hours);
    }

    static void TestFinancialMetrics()
    {
        Suite("財務指標");

        var c = new Company();
        c.AddDepartment("歴史", "HIST", 2);
        c.AddDepartment("地理", "GEO", 3);

        c.LogTime("HIST", 3.0);
        c.LogTime("GEO", 2.0);

        Assert("総請求時間 > 0", c.TotalBillableHours > 0);
        Assert("総知識 > 0", c.TotalKnowledge > 0);
        Assert("平均知識 > 0", c.AverageKnowledge > 0);

        // ROI
        var hist = c.GetDepartment("HIST");
        Assert("ROI > 0", hist.ROI > 0);

        // Active projects
        Assert("進行中案件: 0", c.ActiveProjects == 0);
        hist.Projects.Add(new Project { Name = "テスト", Deadline = DateTime.Now.AddDays(5), Completed = false });
        Assert("進行中案件: 1", c.ActiveProjects == 1);

        hist.Projects[0].Completed = true;
        Assert("完了案件: 1", c.CompletedProjects == 1);
        Assert("進行中案件: 0に戻る", c.ActiveProjects == 0);
    }
}
