using System;

namespace WreckHouse
{
    public class PatienceMeter
    {
        public int Current { get; private set; }
        public int Max { get; private set; }
        public string ParentName { get; private set; }
        public string LastReaction { get; private set; }

        private static readonly string[] MildReactions = new[]
        {
            "\"Be careful with that!\"",
            "\"What was that noise?!\"",
            "\"Are you SURE you know what you're doing?\"",
            "\"Maybe I should have hired a professional...\"",
            "\"Just... try not to break anything else.\"",
            "*deep sigh*"
        };

        private static readonly string[] MediumReactions = new[]
        {
            "\"WHAT DID YOU DO?!\"",
            "\"That's coming out of your allowance!\"",
            "\"I TOLD you not to touch that!\"",
            "\"Your mother/father is going to KILL me.\"",
            "\"How did you even-- never mind. Just stop.\"",
            "*stress-eating begins*"
        };

        private static readonly string[] SevereReactions = new[]
        {
            "\"THE HOUSE IS ON FIRE!\"",
            "\"THAT'S IT! NO WIFI FOR A MONTH!\"",
            "\"I'M CALLING THE INSURANCE COMPANY!\"",
            "\"WE'RE SELLING THE HOUSE! AND YOU!\"",
            "\"I should have listened to your grandma about military school!\"",
            "*calls real estate agent in tears*"
        };

        private Random rng;

        public PatienceMeter(string parentName, Random rng)
        {
            Current = 100;
            Max = 100;
            ParentName = parentName;
            LastReaction = "";
            this.rng = rng;
        }

        public PatienceMeter(string parentName) : this(parentName, new Random()) { }

        public string React(ChainResult result)
        {
            int loss = 0;

            // Base loss for each destroyed object
            loss += result.TotalDestroyed * 8;

            // Extra loss for chain depth
            loss += result.MaxDepth * 5;

            // Cross-room disaster is extra bad
            if (result.CrossedRooms) loss += 15;

            Current -= loss;
            if (Current < 0) Current = 0;

            // Pick reaction based on severity
            string[] reactions;
            if (loss <= 10) reactions = MildReactions;
            else if (loss <= 25) reactions = MediumReactions;
            else reactions = SevereReactions;

            LastReaction = ParentName + ": " + reactions[rng.Next(reactions.Length)];
            return LastReaction;
        }

        public bool IsExhausted()
        {
            return Current <= 0;
        }

        public string GetMeterDisplay()
        {
            int filled = (int)((double)Current / Max * 20);
            int empty = 20 - filled;
            string bar = "[";
            for (int i = 0; i < filled; i++) bar += "#";
            for (int i = 0; i < empty; i++) bar += "-";
            bar += "]";
            return "Patience: " + bar + " " + Current + "/" + Max;
        }

        public string GetMood()
        {
            if (Current > 75) return "Calm";
            if (Current > 50) return "Annoyed";
            if (Current > 25) return "Furious";
            if (Current > 0) return "Volcanic";
            return "Gone";
        }
    }
}
