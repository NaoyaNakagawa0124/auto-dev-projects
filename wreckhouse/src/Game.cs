using System;
using System.Collections.Generic;

namespace WreckHouse
{
    public class Game
    {
        public List<Room> Rooms { get; private set; }
        public List<Tool> Tools { get; private set; }
        public ScoreKeeper Score { get; private set; }
        public PatienceMeter Patience { get; private set; }
        public SocialFeed Social { get; private set; }
        public int MaxTurns { get; private set; }
        public int CurrentTurn { get; private set; }
        public bool GameOver { get; private set; }
        public string GameOverReason { get; private set; }
        private Random rng;

        public Game(int seed)
        {
            rng = new Random(seed);
            Rooms = Room.CreateAllRooms();
            Tools = Tool.CreateAllTools();
            Score = new ScoreKeeper();
            Patience = new PatienceMeter("Dad", rng);
            Social = new SocialFeed(rng);
            MaxTurns = 15;
            CurrentTurn = 0;
            GameOver = false;
            GameOverReason = "";
        }

        public Game() : this(Environment.TickCount) { }

        public bool AllRoomsWrecked()
        {
            foreach (var room in Rooms)
            {
                if (!room.IsFullyWrecked()) return false;
            }
            return true;
        }

        public int TotalDestroyedObjects()
        {
            int total = 0;
            foreach (var room in Rooms)
            {
                total += room.DestroyedCount();
            }
            return total;
        }

        public int TotalObjects()
        {
            int total = 0;
            foreach (var room in Rooms)
            {
                total += room.TotalObjects();
            }
            return total;
        }

        public TurnResult PlayTurn(int roomIndex, int toolIndex, int objectIndex)
        {
            if (GameOver) return null;
            if (roomIndex < 0 || roomIndex >= Rooms.Count) return null;
            if (toolIndex < 0 || toolIndex >= Tools.Count) return null;

            var room = Rooms[roomIndex];
            if (objectIndex < 0 || objectIndex >= room.Objects.Count) return null;

            var target = room.Objects[objectIndex];
            if (target.Destroyed) return null;

            var tool = Tools[toolIndex];
            CurrentTurn++;

            // Resolve chain reaction
            var chain = new ChainReaction(rng);
            var chainResult = chain.ResolveAcrossRooms(target, tool, room, Rooms);

            // Score the turn
            int turnScore = Score.CalculateTurnScore(chainResult, tool);

            // Parent reacts
            string reaction = Patience.React(chainResult);

            // Generate social post for significant destruction
            SocialPost post = null;
            if (chainResult.TotalDestroyed >= 2 || chainResult.CrossedRooms)
            {
                post = Social.GeneratePost(chainResult, room.Name, tool, turnScore);
            }

            // Check game over conditions
            if (Patience.IsExhausted())
            {
                GameOver = true;
                GameOverReason = "Your parent's patience has run out! You're grounded for life!";
            }
            else if (AllRoomsWrecked())
            {
                GameOver = true;
                GameOverReason = "THE ENTIRE HOUSE IS DESTROYED! Achievement unlocked: Total Wreckage!";
            }
            else if (CurrentTurn >= MaxTurns)
            {
                GameOver = true;
                GameOverReason = "Time's up! Your parent finally kicked you out of the renovation project.";
            }

            return new TurnResult
            {
                Chain = chainResult,
                TurnScore = turnScore,
                Reaction = reaction,
                Post = post,
                IsGameOver = GameOver,
                GameOverReason = GameOverReason
            };
        }

        public string[] GetGameOverScreen()
        {
            var lines = new List<string>();
            lines.Add("");
            lines.Add("========================================");
            lines.Add("          GAME OVER - WRECKHOUSE        ");
            lines.Add("========================================");
            lines.Add("");
            lines.Add("  " + GameOverReason);
            lines.Add("");
            lines.Add("  Final Score: " + Score.TotalScore);
            lines.Add("  Rank: " + Score.GetRank() + " " + Score.GetStarRating());
            lines.Add("  Turns Played: " + Score.TurnsPlayed);
            lines.Add("  Objects Destroyed: " + TotalDestroyedObjects() + "/" + TotalObjects());
            lines.Add("  Best Combo: " + Score.BestCombo);
            lines.Add("  Rooms Crossed: " + Score.RoomsCrossed);
            lines.Add("");

            // Room damage summary
            lines.Add("  Room Damage Report:");
            foreach (var room in Rooms)
            {
                string pct = room.DestructionPercent().ToString("0") + "%";
                string bar = "  [";
                int filled = (int)(room.DestructionPercent() / 5);
                for (int i = 0; i < filled; i++) bar += "#";
                for (int i = filled; i < 20; i++) bar += "-";
                bar += "]";
                lines.Add("    " + room.Name.PadRight(14) + bar + " " + pct);
            }

            lines.Add("");

            // Best social posts
            if (Social.Posts.Count > 0)
            {
                lines.Add("  Your Best Viral Moments:");
                int count = Math.Min(3, Social.Posts.Count);
                // Sort by likes descending
                var sorted = new List<SocialPost>(Social.Posts);
                sorted.Sort((a, b) => b.Likes.CompareTo(a.Likes));
                for (int i = 0; i < count; i++)
                {
                    lines.Add("    " + (i + 1) + ". " + sorted[i].Text.Substring(0, Math.Min(50, sorted[i].Text.Length)) + "...");
                    lines.Add("       ♥ " + sorted[i].Likes + " likes on " + sorted[i].Platform);
                }
            }

            lines.Add("");
            lines.Add("========================================");
            return lines.ToArray();
        }
    }

    public class TurnResult
    {
        public ChainResult Chain { get; set; }
        public int TurnScore { get; set; }
        public string Reaction { get; set; }
        public SocialPost Post { get; set; }
        public bool IsGameOver { get; set; }
        public string GameOverReason { get; set; }
    }
}
