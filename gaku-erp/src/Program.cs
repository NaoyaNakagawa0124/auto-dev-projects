using System;
using System.Linq;

namespace GakuERP
{
    class Program
    {
        static Company company = new Company();

        static void Main(string[] args)
        {
            Display.Clear();
            Display.Banner();

            Console.WriteLine("  あなたは今日から「勉強株式会社」のCEO。");
            Console.WriteLine("  科目を「部署」として経営し、テストという「案件」を乗り越えよう。");
            Console.WriteLine();
            Display.Info("まずは部署（科目）を追加しましょう。");
            Console.WriteLine();
            Display.WaitForKey();

            bool running = true;
            while (running)
            {
                Display.Clear();
                Display.Banner();
                Display.Dashboard(company);
                Display.Menu();

                string input = Display.Prompt("選択");
                switch (input)
                {
                    case "1": DoWork(); break;
                    case "2": ManageDepartments(); break;
                    case "3": ManageProjects(); break;
                    case "4": CompleteProject(); break;
                    case "5": TakePTO(); break;
                    case "6": Sleep(); break;
                    case "7": Display.ShowFinancialReport(company); Display.WaitForKey(); break;
                    case "q": case "Q": running = false; break;
                    default: Display.Error("無効な選択です"); Display.WaitForKey(); break;
                }
            }

            ShowExitReport();
        }

        static void DoWork()
        {
            if (company.Departments.Count == 0)
            {
                Display.Warning("部署がありません。先に科目を追加してください。");
                Display.WaitForKey();
                return;
            }

            if (company.Employee.Energy < 10)
            {
                Display.Warning("体力が限界です。休憩か就寝をしてください。");
                Display.WaitForKey();
                return;
            }

            Console.WriteLine();
            Console.WriteLine("  どの部署で勤務しますか？");
            for (int i = 0; i < company.Departments.Count; i++)
            {
                var d = company.Departments[i];
                Console.WriteLine($"  {i + 1}. {d.Name} ({d.Code}) — 知識: {d.KnowledgeStock:F1}");
            }

            int idx = Display.PromptInt("部署番号", 1, company.Departments.Count) - 1;
            var dept = company.Departments[idx];

            Console.WriteLine();
            Console.WriteLine("  勤務時間は？");
            Console.WriteLine("  1. 30分 (0.5h)");
            Console.WriteLine("  2. 1時間");
            Console.WriteLine("  3. 2時間");
            Console.WriteLine("  4. 3時間（長時間勤務）");

            int timeChoice = Display.PromptInt("選択", 1, 4);
            double[] hours = { 0.5, 1.0, 2.0, 3.0 };
            double h = hours[timeChoice - 1];

            var entry = company.LogTime(dept.Code, h);
            Display.ShowTimeLog(entry, dept);

            // Employee warnings
            if (company.Employee.Energy < 30)
                Display.Warning("体力が低下しています。無理は禁物。");
            if (company.Employee.Focus < 30)
                Display.Warning("集中力が低下。効率が落ちています。");
            if (company.Employee.ConsecutiveOvertimeDays >= 3)
                Display.Warning("残業が3日以上続いています！士気が下がっています。");

            Display.WaitForKey();
        }

        static void ManageDepartments()
        {
            Console.WriteLine();
            Console.WriteLine("  1. 新規部署を追加");
            Console.WriteLine("  2. 部署一覧を確認");
            string choice = Display.Prompt("選択");

            if (choice == "1")
            {
                string name = Display.Prompt("科目名（例: 数学）");
                if (string.IsNullOrWhiteSpace(name)) return;

                string code = Display.Prompt("コード（例: MATH）");
                if (string.IsNullOrWhiteSpace(code)) code = name.ToUpper().Substring(0, Math.Min(4, name.Length));

                int prio = Display.PromptInt("優先度 (1-5)", 1, 5);

                company.AddDepartment(name, code, prio);
                Display.Success($"部署「{name}」({code}) を設立しました！");
            }
            else if (choice == "2")
            {
                if (company.Departments.Count == 0)
                {
                    Display.Info("まだ部署がありません。");
                }
                else
                {
                    foreach (var d in company.Departments)
                    {
                        Console.WriteLine($"\n  📁 {d.Name} ({d.Code})");
                        Console.WriteLine($"     優先度: {new string('★', d.Priority)}{new string('☆', 5 - d.Priority)}");
                        Console.WriteLine($"     知識在庫: {d.KnowledgeStock:F1}/100  減衰率: {d.DecayRate:F1}/日");
                        Console.WriteLine($"     請求時間: {d.TotalBillableHours:F1}h  ROI: {d.ROI:F1}");
                    }
                }
            }

            Display.WaitForKey();
        }

        static void ManageProjects()
        {
            if (company.Departments.Count == 0)
            {
                Display.Warning("部署がありません。先に科目を追加してください。");
                Display.WaitForKey();
                return;
            }

            string name = Display.Prompt("案件名（例: 中間テスト）");
            if (string.IsNullOrWhiteSpace(name)) return;

            Console.WriteLine("  対象部署:");
            for (int i = 0; i < company.Departments.Count; i++)
                Console.WriteLine($"  {i + 1}. {company.Departments[i].Name}");

            int idx = Display.PromptInt("部署番号", 1, company.Departments.Count) - 1;
            var dept = company.Departments[idx];

            int days = Display.PromptInt("納期（何日後？）", 1, 365);
            int difficulty = Display.PromptInt("必要知識レベル (1-100)", 1, 100);

            var project = new Project
            {
                Name = name,
                Deadline = DateTime.Now.AddDays(days),
                DepartmentCode = dept.Code,
                RequiredKnowledge = difficulty,
                Completed = false
            };

            dept.Projects.Add(project);
            Display.Success($"案件「{name}」を登録しました（納期: {days}日後、必要知識: {difficulty}）");
            Display.WaitForKey();
        }

        static void CompleteProject()
        {
            var pending = company.Departments
                .SelectMany(d => d.Projects.Where(p => !p.Completed).Select(p => new { Dept = d, Project = p }))
                .ToList();

            if (pending.Count == 0)
            {
                Display.Info("完了可能な案件がありません。");
                Display.WaitForKey();
                return;
            }

            Console.WriteLine();
            Console.WriteLine("  完了する案件を選択:");
            for (int i = 0; i < pending.Count; i++)
            {
                var p = pending[i];
                Console.WriteLine($"  {i + 1}. {p.Project.Name} ({p.Dept.Name}) — 残り{p.Project.DaysRemaining}日");
            }

            int idx = Display.PromptInt("番号", 1, pending.Count) - 1;
            var selected = pending[idx];

            string grade = company.GenerateGrade(selected.Dept.KnowledgeStock, selected.Project.RequiredKnowledge);
            selected.Project.Completed = true;
            selected.Project.Grade = grade;

            Console.WriteLine();
            Display.Success($"案件「{selected.Project.Name}」完了！");
            Console.WriteLine($"  評価: {grade}ランク（知識: {selected.Dept.KnowledgeStock:F1} / 必要: {selected.Project.RequiredKnowledge}）");

            if (grade == "S") Console.WriteLine("  🏆 素晴らしい！クライアント大満足です！");
            else if (grade == "A") Console.WriteLine("  ⭐ 優秀な成果です。");
            else if (grade == "B") Console.WriteLine("  👍 まずまずの結果です。");
            else if (grade == "C") Console.WriteLine("  ⚠ ギリギリセーフ...。");
            else Console.WriteLine("  💀 クライアントが不満を感じています...");

            Display.WaitForKey();
        }

        static void TakePTO()
        {
            company.Employee.Rest();
            Console.WriteLine();
            Display.Success("有給休暇を取得しました。");
            Display.Info("体力とメンタルが回復しました。");
            Display.WaitForKey();
        }

        static void Sleep()
        {
            company.Employee.Sleep();
            company.DailyDecay();
            Console.WriteLine();
            Display.Info("就寝しました。翌日になりました。");
            Display.Warning("各部署の知識在庫が減衰しました。");
            Display.WaitForKey();
        }

        static void ShowExitReport()
        {
            Display.Clear();
            Display.Banner();
            Console.WriteLine("  📋 退職レポート");
            Console.WriteLine($"  ──────────────────────");
            Console.WriteLine($"  在籍日数: {company.DayNumber}日");
            Console.WriteLine($"  総請求時間: {company.TotalBillableHours:F1}h");
            Console.WriteLine($"  完了案件: {company.CompletedProjects}件");
            Console.WriteLine($"  平均知識: {company.AverageKnowledge:F1}/100");
            Console.WriteLine();

            var completed = company.Departments.SelectMany(d => d.Projects.Where(p => p.Completed)).ToList();
            if (completed.Count > 0)
            {
                Console.WriteLine("  案件成績:");
                foreach (var p in completed)
                    Console.WriteLine($"    {p.Name}: {p.Grade}ランク");
            }

            Console.WriteLine();
            Console.WriteLine("  お疲れさまでした。また明日から頑張りましょう。");
            Console.WriteLine();
        }
    }
}
