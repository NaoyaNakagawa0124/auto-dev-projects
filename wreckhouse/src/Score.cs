using System;

namespace WreckHouse
{
    public class ScoreKeeper
    {
        public int TotalScore { get; private set; }
        public int TurnsPlayed { get; private set; }
        public int BestCombo { get; private set; }
        public int TotalObjectsDestroyed { get; private set; }
        public int RoomsCrossed { get; private set; }
        public int CurrentStreak { get; private set; }

        public ScoreKeeper()
        {
            TotalScore = 0;
            TurnsPlayed = 0;
            BestCombo = 0;
            TotalObjectsDestroyed = 0;
            RoomsCrossed = 0;
            CurrentStreak = 0;
        }

        public int CalculateTurnScore(ChainResult result, Tool tool)
        {
            int score = 0;

            // Base points per destroyed object
            score += result.TotalDestroyed * 100;

            // Chain depth bonus (exponential)
            if (result.MaxDepth >= 2)
            {
                score += (int)Math.Pow(result.MaxDepth, 2) * 50;
            }

            // Combo bonus for multi-hit chains
            if (result.TotalDestroyed >= 3)
            {
                score += result.TotalDestroyed * 75;
            }

            // Cross-room bonus
            if (result.CrossedRooms)
            {
                score += 500;
                RoomsCrossed++;
            }

            // Tool-specific bonuses
            if (tool.Name == "Duct Tape" && result.TotalDestroyed > 0)
            {
                score *= 3; // Triple points for destruction with duct tape
            }
            else if (tool.Name == "Sledgehammer" && result.TotalDestroyed >= 4)
            {
                score += 300; // Sledgehammer overkill bonus
            }

            // Streak multiplier
            if (result.TotalDestroyed > 1)
            {
                CurrentStreak++;
                score = (int)(score * (1.0 + CurrentStreak * 0.1));
            }
            else
            {
                CurrentStreak = 0;
            }

            // Update stats
            TurnsPlayed++;
            TotalObjectsDestroyed += result.TotalDestroyed;
            if (result.TotalDestroyed > BestCombo) BestCombo = result.TotalDestroyed;
            TotalScore += score;

            return score;
        }

        public string GetRank()
        {
            if (TotalScore >= 10000) return "LEGENDARY WRECKER";
            if (TotalScore >= 7000) return "Master Destroyer";
            if (TotalScore >= 4000) return "Chaos Agent";
            if (TotalScore >= 2000) return "Demolition Intern";
            if (TotalScore >= 500) return "Accidental Vandal";
            return "Helpful Teen";
        }

        public string GetStarRating()
        {
            if (TotalScore >= 10000) return "*****";
            if (TotalScore >= 7000) return "****";
            if (TotalScore >= 4000) return "***";
            if (TotalScore >= 2000) return "**";
            if (TotalScore >= 500) return "*";
            return "";
        }
    }
}
