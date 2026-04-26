using System;
using System.Collections.Generic;
using System.Linq;

namespace GakuERP
{
    public class Department
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int Priority { get; set; } // 1-5
        public double KnowledgeStock { get; set; } // 0-100
        public double DecayRate { get; set; } // Daily knowledge decay
        public List<TimeEntry> TimeEntries { get; set; } = new List<TimeEntry>();
        public List<Project> Projects { get; set; } = new List<Project>();

        public double TotalBillableHours => TimeEntries.Sum(t => t.BillableHours);
        public double TotalOvertimeHours => TimeEntries.Where(t => t.IsOvertime).Sum(t => t.Hours);
        public double ROI => TotalBillableHours > 0 ? KnowledgeStock / TotalBillableHours * 10 : 0;

        public void ApplyDecay()
        {
            KnowledgeStock = Math.Max(0, KnowledgeStock - DecayRate);
        }

        public void AddKnowledge(double hours, bool isOvertime)
        {
            double gain = hours * 5.0; // 1 hour = 5 knowledge points
            if (isOvertime) gain *= 0.7; // Overtime is less efficient
            KnowledgeStock = Math.Min(100, KnowledgeStock + gain);
        }
    }

    public class TimeEntry
    {
        public DateTime Timestamp { get; set; }
        public double Hours { get; set; }
        public double BillableHours { get; set; } // With overtime multiplier
        public bool IsOvertime { get; set; }
        public string DepartmentCode { get; set; }
    }

    public class Project
    {
        public string Name { get; set; }
        public DateTime Deadline { get; set; }
        public string DepartmentCode { get; set; }
        public double RequiredKnowledge { get; set; } // 0-100
        public bool Completed { get; set; }
        public string Grade { get; set; }

        public int DaysRemaining => (int)(Deadline - DateTime.Now).TotalDays;
        public string Status => Completed ? "完了" : DaysRemaining < 0 ? "期限切れ" : DaysRemaining <= 3 ? "緊急" : "進行中";
    }

    public class Employee
    {
        public double Energy { get; set; } = 100;    // 0-100
        public double Focus { get; set; } = 100;     // 0-100
        public double Morale { get; set; } = 80;     // 0-100
        public int ConsecutiveOvertimeDays { get; set; }
        public int TotalPTOUsed { get; set; }

        public string ConditionLabel
        {
            get
            {
                if (Energy > 70 && Focus > 70) return "絶好調";
                if (Energy > 40 && Focus > 40) return "通常";
                if (Energy > 20 || Focus > 20) return "疲労";
                return "限界";
            }
        }

        public void Work(double hours, bool isOvertime)
        {
            double energyCost = hours * 8;
            double focusCost = hours * 6;
            if (isOvertime)
            {
                energyCost *= 1.5;
                focusCost *= 1.8;
                ConsecutiveOvertimeDays++;
                if (ConsecutiveOvertimeDays > 3) Morale = Math.Max(0, Morale - 5);
            }
            else
            {
                ConsecutiveOvertimeDays = 0;
            }
            Energy = Math.Max(0, Energy - energyCost);
            Focus = Math.Max(0, Focus - focusCost);
        }

        public void Rest()
        {
            Energy = Math.Min(100, Energy + 30);
            Focus = Math.Min(100, Focus + 25);
            Morale = Math.Min(100, Morale + 5);
            TotalPTOUsed++;
            ConsecutiveOvertimeDays = 0;
        }

        public void Sleep()
        {
            Energy = Math.Min(100, Energy + 50);
            Focus = Math.Min(100, Focus + 40);
        }
    }

    public class Company
    {
        public List<Department> Departments { get; set; } = new List<Department>();
        public Employee Employee { get; set; } = new Employee();
        public List<TimeEntry> AllTimeEntries { get; set; } = new List<TimeEntry>();
        public int DayNumber { get; set; } = 1;

        public double TotalBillableHours => AllTimeEntries.Sum(t => t.BillableHours);
        public double TotalKnowledge => Departments.Sum(d => d.KnowledgeStock);
        public double AverageKnowledge => Departments.Count > 0 ? Departments.Average(d => d.KnowledgeStock) : 0;
        public int ActiveProjects => Departments.SelectMany(d => d.Projects).Count(p => !p.Completed);
        public int CompletedProjects => Departments.SelectMany(d => d.Projects).Count(p => p.Completed);

        public Department GetDepartment(string code)
        {
            return Departments.FirstOrDefault(d => d.Code == code);
        }

        public void AddDepartment(string name, string code, int priority)
        {
            Departments.Add(new Department
            {
                Name = name,
                Code = code,
                Priority = priority,
                KnowledgeStock = 10,
                DecayRate = 1.0 + (priority - 1) * 0.3
            });
        }

        public TimeEntry LogTime(string deptCode, double hours)
        {
            bool isOvertime = DateTime.Now.Hour >= 22 || DateTime.Now.Hour < 5;
            double billable = isOvertime ? hours * 1.5 : hours;

            var entry = new TimeEntry
            {
                Timestamp = DateTime.Now,
                Hours = hours,
                BillableHours = billable,
                IsOvertime = isOvertime,
                DepartmentCode = deptCode
            };

            AllTimeEntries.Add(entry);
            var dept = GetDepartment(deptCode);
            if (dept != null)
            {
                dept.TimeEntries.Add(entry);
                dept.AddKnowledge(hours, isOvertime);
            }
            Employee.Work(hours, isOvertime);

            return entry;
        }

        public void DailyDecay()
        {
            foreach (var d in Departments) d.ApplyDecay();
            DayNumber++;
        }

        public string GenerateGrade(double knowledge, double required)
        {
            double ratio = knowledge / Math.Max(1, required);
            if (ratio >= 1.2) return "S";
            if (ratio >= 1.0) return "A";
            if (ratio >= 0.8) return "B";
            if (ratio >= 0.6) return "C";
            return "D";
        }
    }
}
