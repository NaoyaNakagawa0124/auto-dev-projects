using System;
using System.Collections.Generic;

namespace WreckHouse
{
    public class Tool
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Description { get; set; }
        public string PrimaryEffect { get; set; }
        public double DisasterChance { get; set; }
        public int BaseDamage { get; set; }
        public string[] BonusEffects { get; set; }

        public Tool(string name, string icon, string description, string primaryEffect,
                     double disasterChance, int baseDamage, string[] bonusEffects)
        {
            Name = name;
            Icon = icon;
            Description = description;
            PrimaryEffect = primaryEffect;
            DisasterChance = disasterChance;
            BaseDamage = baseDamage;
            BonusEffects = bonusEffects;
        }

        public string[] GetAllEffects()
        {
            var effects = new List<string>();
            effects.Add(PrimaryEffect);
            foreach (var e in BonusEffects) effects.Add(e);
            return effects.ToArray();
        }

        public static Tool CreateHammer()
        {
            return new Tool("Hammer", "[H]", "The classic. Fixes everything by breaking it.",
                "impact", 0.7, 15, new[] { "weight" });
        }

        public static Tool CreatePaintRoller()
        {
            return new Tool("Paint Roller", "[P]", "For 'touching up' the walls. And ceiling. And floor.",
                "water", 0.5, 8, new[] { "impact" });
        }

        public static Tool CreateDrill()
        {
            return new Tool("Drill", "[D]", "Holes in things that shouldn't have holes.",
                "impact", 0.8, 20, new[] { "electric" });
        }

        public static Tool CreateBlowtorch()
        {
            return new Tool("Blowtorch", "[B]", "For 'precision' work. Emphasis on the quotes.",
                "fire", 0.9, 25, new[] { "fire" });
        }

        public static Tool CreateWrench()
        {
            return new Tool("Wrench", "[W]", "Lefty loosey, righty... also loosey?",
                "impact", 0.6, 12, new[] { "water" });
        }

        public static Tool CreateSledgehammer()
        {
            return new Tool("Sledgehammer", "[S]", "When subtlety isn't an option. (It never was.)",
                "impact", 0.95, 30, new[] { "weight", "impact" });
        }

        public static Tool CreateGardenHose()
        {
            return new Tool("Garden Hose", "[G]", "You brought this inside. Why did you bring this inside?",
                "water", 0.85, 18, new[] { "water", "electric" });
        }

        public static Tool CreateDuctTape()
        {
            return new Tool("Duct Tape", "[T]", "Fixes everything! (Narrator: it fixed nothing.)",
                "impact", 0.3, 5, new string[0]);
        }

        public static List<Tool> CreateAllTools()
        {
            return new List<Tool>
            {
                CreateHammer(),
                CreatePaintRoller(),
                CreateDrill(),
                CreateBlowtorch(),
                CreateWrench(),
                CreateSledgehammer(),
                CreateGardenHose(),
                CreateDuctTape()
            };
        }
    }
}
