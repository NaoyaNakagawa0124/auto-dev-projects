using System;
using System.Collections.Generic;
using System.Linq;

namespace GakuERP
{
    public static class Display
    {
        const string RESET = "\x1b[0m";
        const string BOLD = "\x1b[1m";
        const string DIM = "\x1b[2m";
        const string RED = "\x1b[31m";
        const string GREEN = "\x1b[32m";
        const string YELLOW = "\x1b[33m";
        const string BLUE = "\x1b[34m";
        const string MAGENTA = "\x1b[35m";
        const string CYAN = "\x1b[36m";
        const string WHITE = "\x1b[37m";
        const string GRAY = "\x1b[90m";

        public static void Clear() => Console.Write("\x1b[2J\x1b[H");

        public static void Banner()
        {
            Console.WriteLine();
            Console.WriteLine($"{CYAN}  ┌──────────────────────────────────┐{RESET}");
            Console.WriteLine($"{CYAN}  │{RESET} {BOLD}📊 学ERP{RESET}  {DIM}Gaku Enterprise RP{RESET}     {CYAN}│{RESET}");
            Console.WriteLine($"{CYAN}  │{RESET} {DIM}勉強エンタープライズリソース管理{RESET}   {CYAN}│{RESET}");
            Console.WriteLine($"{CYAN}  └──────────────────────────────────┘{RESET}");
            Console.WriteLine();
        }

        public static void Dashboard(Company c)
        {
            Console.WriteLine($"  {GRAY}── 経営ダッシュボード ──{RESET}");
            Console.WriteLine();
            Console.WriteLine($"  {BOLD}📈 KPI サマリー{RESET}  {DIM}(Day {c.DayNumber}){RESET}");
            Console.WriteLine();
            Console.WriteLine($"  総請求時間    {YELLOW}{c.TotalBillableHours:F1}h{RESET}");
            Console.WriteLine($"  知識在庫(平均) {ColorByLevel(c.AverageKnowledge)}{c.AverageKnowledge:F1}/100{RESET}");
            Console.WriteLine($"  部署数       {CYAN}{c.Departments.Count}{RESET}");
            Console.WriteLine($"  進行中案件    {YELLOW}{c.ActiveProjects}{RESET}  完了: {GREEN}{c.CompletedProjects}{RESET}");
            Console.WriteLine();

            // Employee status
            var e = c.Employee;
            Console.WriteLine($"  {BOLD}👤 従業員ステータス{RESET}  {DIM}[{e.ConditionLabel}]{RESET}");
            Console.WriteLine($"  体力   {Bar(e.Energy, 20, GREEN, YELLOW, RED)} {e.Energy:F0}%");
            Console.WriteLine($"  集中力  {Bar(e.Focus, 20, CYAN, YELLOW, RED)} {e.Focus:F0}%");
            Console.WriteLine($"  士気   {Bar(e.Morale, 20, MAGENTA, YELLOW, RED)} {e.Morale:F0}%");
            Console.WriteLine($"  {DIM}残業連続: {e.ConsecutiveOvertimeDays}日  有給使用: {e.TotalPTOUsed}日{RESET}");
            Console.WriteLine();

            // Departments
            if (c.Departments.Count > 0)
            {
                Console.WriteLine($"  {BOLD}🏢 部署別レポート{RESET}");
                Console.WriteLine($"  {DIM}{"部署",-12} {"知識在庫",-10} {"請求時間",-10} {"ROI",-8} {"優先度"}{RESET}");
                Console.WriteLine($"  {DIM}{"─",-12} {"──────",-10} {"──────",-10} {"───",-8} {"───"}{RESET}");
                foreach (var d in c.Departments.OrderByDescending(d => d.Priority))
                {
                    string prio = new string('★', d.Priority) + new string('☆', 5 - d.Priority);
                    Console.WriteLine($"  {d.Name,-12} {ColorByLevel(d.KnowledgeStock)}{d.KnowledgeStock:F1,-10}{RESET} {YELLOW}{d.TotalBillableHours:F1}h{RESET,-9} {d.ROI:F1,-8} {YELLOW}{prio}{RESET}");
                }
                Console.WriteLine();
            }

            // Urgent projects
            var urgent = c.Departments.SelectMany(d => d.Projects).Where(p => !p.Completed && p.DaysRemaining <= 7).ToList();
            if (urgent.Count > 0)
            {
                Console.WriteLine($"  {RED}{BOLD}⚠ 緊急案件{RESET}");
                foreach (var p in urgent.OrderBy(p => p.DaysRemaining))
                {
                    string color = p.DaysRemaining <= 1 ? RED : YELLOW;
                    Console.WriteLine($"  {color}  {p.Name} — 残り{p.DaysRemaining}日 ({p.DepartmentCode}){RESET}");
                }
                Console.WriteLine();
            }
        }

        public static void Menu()
        {
            Console.WriteLine($"  {BOLD}操作メニュー{RESET}");
            Console.WriteLine();
            Console.WriteLine($"  {CYAN}1.{RESET} 勤務開始（勉強する）");
            Console.WriteLine($"  {CYAN}2.{RESET} 部署管理（科目の追加・確認）");
            Console.WriteLine($"  {CYAN}3.{RESET} 案件管理（テスト/試験の登録）");
            Console.WriteLine($"  {CYAN}4.{RESET} 案件完了（テスト結果を記録）");
            Console.WriteLine($"  {CYAN}5.{RESET} 有給休暇（休憩する）");
            Console.WriteLine($"  {CYAN}6.{RESET} 就寝（日をまたぐ）");
            Console.WriteLine($"  {CYAN}7.{RESET} 財務レポート");
            Console.WriteLine($"  {CYAN}q.{RESET} 退職（終了）");
            Console.WriteLine();
        }

        public static void ShowTimeLog(TimeEntry entry, Department dept)
        {
            string otStr = entry.IsOvertime ? $" {YELLOW}(深夜残業 1.5x){RESET}" : "";
            Console.WriteLine();
            Console.WriteLine($"  {GREEN}✓ タイムシート記録完了{RESET}{otStr}");
            Console.WriteLine($"  {DIM}部署: {dept?.Name}  実働: {entry.Hours:F1}h  請求: {entry.BillableHours:F1}h{RESET}");
            if (dept != null)
                Console.WriteLine($"  {DIM}知識在庫: {dept.KnowledgeStock:F1}/100{RESET}");
        }

        public static void ShowFinancialReport(Company c)
        {
            Console.WriteLine();
            Console.WriteLine($"  {BOLD}💹 財務レポート{RESET}");
            Console.WriteLine($"  {DIM}──────────────────────────{RESET}");
            Console.WriteLine();

            double totalHours = c.TotalBillableHours;
            double overtimeHours = c.AllTimeEntries.Where(t => t.IsOvertime).Sum(t => t.Hours);
            double regularHours = totalHours - overtimeHours;
            double avgDaily = c.DayNumber > 0 ? totalHours / c.DayNumber : 0;

            Console.WriteLine($"  総請求時間      {YELLOW}{totalHours:F1}h{RESET}");
            Console.WriteLine($"  うち通常時間    {GREEN}{regularHours:F1}h{RESET}");
            Console.WriteLine($"  うち残業時間    {RED}{overtimeHours:F1}h{RESET}");
            Console.WriteLine($"  1日平均        {CYAN}{avgDaily:F1}h/日{RESET}");
            Console.WriteLine();

            Console.WriteLine($"  {BOLD}部署別投資対効果{RESET}");
            foreach (var d in c.Departments.OrderByDescending(d => d.ROI))
            {
                string bar = new string('█', (int)Math.Min(d.ROI, 20));
                Console.WriteLine($"  {d.Name,-10} {CYAN}{bar}{RESET} {d.ROI:F1}");
            }
            Console.WriteLine();

            Console.WriteLine($"  {BOLD}知識ポートフォリオ{RESET}");
            double totalKnowledge = c.TotalKnowledge;
            foreach (var d in c.Departments)
            {
                double pct = totalKnowledge > 0 ? d.KnowledgeStock / totalKnowledge * 100 : 0;
                Console.WriteLine($"  {d.Name,-10} {Bar(d.KnowledgeStock, 15, GREEN, YELLOW, RED)} {d.KnowledgeStock:F1} ({pct:F0}%)");
            }
            Console.WriteLine();
        }

        public static string Bar(double value, int width, string high, string mid, string low)
        {
            int filled = (int)(value / 100.0 * width);
            filled = Math.Max(0, Math.Min(width, filled));
            string color = value > 60 ? high : value > 30 ? mid : low;
            return $"{color}{new string('█', filled)}{GRAY}{new string('░', width - filled)}{RESET}";
        }

        static string ColorByLevel(double value)
        {
            if (value >= 70) return GREEN;
            if (value >= 40) return YELLOW;
            return RED;
        }

        public static void Info(string msg) => Console.WriteLine($"  {DIM}{msg}{RESET}");
        public static void Success(string msg) => Console.WriteLine($"  {GREEN}✓ {msg}{RESET}");
        public static void Warning(string msg) => Console.WriteLine($"  {YELLOW}⚠ {msg}{RESET}");
        public static void Error(string msg) => Console.WriteLine($"  {RED}✗ {msg}{RESET}");

        public static void WaitForKey()
        {
            Console.Write($"  {DIM}[Enterで続行]{RESET}");
            Console.ReadLine();
        }

        public static string Prompt(string label)
        {
            Console.Write($"  {CYAN}{label}: {RESET}");
            return Console.ReadLine()?.Trim() ?? "";
        }

        public static int PromptInt(string label, int min, int max)
        {
            while (true)
            {
                string input = Prompt(label);
                if (int.TryParse(input, out int val) && val >= min && val <= max)
                    return val;
                Error($"{min}〜{max}の数字を入力してください");
            }
        }
    }
}
