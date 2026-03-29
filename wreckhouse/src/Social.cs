using System;
using System.Collections.Generic;

namespace WreckHouse
{
    public class SocialPost
    {
        public string Platform { get; set; }
        public string Username { get; set; }
        public string Text { get; set; }
        public int Likes { get; set; }
        public int Shares { get; set; }
        public string[] Comments { get; set; }
        public string Timestamp { get; set; }

        public SocialPost(string platform, string username, string text, int likes, int shares, string[] comments)
        {
            Platform = platform;
            Username = username;
            Text = text;
            Likes = likes;
            Shares = shares;
            Comments = comments;
            Timestamp = "just now";
        }
    }

    public class SocialFeed
    {
        private static readonly string[] Platforms = new[]
        {
            "WreckTok", "Instagroan", "Xplosion", "FailTube", "Disasterdit"
        };

        private static readonly string[] Usernames = new[]
        {
            "xX_DestroyerX", "oops_i_renovated", "DIY_disaster_teen",
            "chaotic_handyman", "wrecking_ball_jr", "not_a_contractor"
        };

        private static readonly string[] Hashtags = new[]
        {
            "#DIYFail", "#RenovationGoneWrong", "#HelpImGrounded",
            "#WreckHouse", "#OopsIDidItAgain", "#SendHelp",
            "#NotMyFault", "#ChainReaction", "#ParentNightmare",
            "#GoodbyeAllowance", "#InsuranceClaim", "#NailedIt"
        };

        private static readonly string[] CommentTemplates = new[]
        {
            "BRO HOW 💀💀💀",
            "this is why they don't let me help either",
            "the chain reaction at the end sent me",
            "your parent's face tho 😭",
            "this is art honestly",
            "hire this kid for demolition",
            "I showed this to my dad and he locked the toolbox",
            "LEGENDARY destruction",
            "insurance company watching this: 📝",
            "tell me you're grounded without telling me you're grounded",
            "the fire spreading to the next room was *chef's kiss*",
            "I've never seen a toilet explode like that before"
        };

        private Random rng;
        public List<SocialPost> Posts { get; private set; }

        public SocialFeed(Random rng)
        {
            this.rng = rng;
            Posts = new List<SocialPost>();
        }

        public SocialFeed() : this(new Random()) { }

        public SocialPost GeneratePost(ChainResult result, string roomName, Tool tool, int score)
        {
            string platform = Platforms[rng.Next(Platforms.Length)];
            string username = Usernames[rng.Next(Usernames.Length)];

            // Generate post text
            string text = GeneratePostText(result, roomName, tool, score);

            // Likes scale with destruction
            int baseLikes = result.TotalDestroyed * 500 + score;
            int likes = baseLikes + rng.Next(baseLikes / 2);

            int shares = likes / 5 + rng.Next(100);

            // Pick 2-4 comments
            int commentCount = 2 + rng.Next(3);
            var comments = new List<string>();
            var usedIndices = new HashSet<int>();
            for (int i = 0; i < commentCount && i < CommentTemplates.Length; i++)
            {
                int idx;
                do { idx = rng.Next(CommentTemplates.Length); } while (usedIndices.Contains(idx));
                usedIndices.Add(idx);
                comments.Add(CommentTemplates[idx]);
            }

            var post = new SocialPost(platform, username, text, likes, shares, comments.ToArray());
            Posts.Add(post);
            return post;
        }

        private string GeneratePostText(ChainResult result, string roomName, Tool tool, int score)
        {
            string text = "";

            if (result.TotalDestroyed >= 5)
                text = "Used a " + tool.Name + " in the " + roomName + " and accidentally destroyed EVERYTHING";
            else if (result.CrossedRooms)
                text = "The " + tool.Name + " incident spread to multiple rooms. I am SO grounded";
            else if (result.MaxDepth >= 3)
                text = "Watch this " + result.MaxDepth + "-chain reaction from just tapping the " + roomName + " with a " + tool.Name;
            else if (result.TotalDestroyed >= 3)
                text = "POV: your parent asks you to 'help' in the " + roomName;
            else
                text = "Me vs the " + roomName + " with a " + tool.Name + " (the " + roomName + " lost)";

            // Add hashtags
            int tagCount = 2 + rng.Next(3);
            var usedTags = new HashSet<int>();
            for (int i = 0; i < tagCount; i++)
            {
                int idx;
                do { idx = rng.Next(Hashtags.Length); } while (usedTags.Contains(idx));
                usedTags.Add(idx);
                text += " " + Hashtags[idx];
            }

            return text;
        }

        public string[] RenderPost(SocialPost post)
        {
            var lines = new List<string>();
            lines.Add("+=================================+");
            lines.Add("| " + post.Platform.PadRight(32) + "|");
            lines.Add("| @" + post.Username.PadRight(31) + "|");
            lines.Add("+---------------------------------+");

            // Word wrap the text at ~33 chars
            string remaining = post.Text;
            while (remaining.Length > 0)
            {
                int len = Math.Min(31, remaining.Length);
                if (len < remaining.Length)
                {
                    int space = remaining.LastIndexOf(' ', len);
                    if (space > 10) len = space;
                }
                lines.Add("| " + remaining.Substring(0, len).PadRight(32) + "|");
                remaining = remaining.Substring(len).TrimStart();
            }

            lines.Add("|                                 |");
            string stats = "| ♥ " + FormatNumber(post.Likes) + "  ↗ " + FormatNumber(post.Shares);
            lines.Add(stats.PadRight(34) + "|");
            lines.Add("+---------------------------------+");

            foreach (var comment in post.Comments)
            {
                string c = "  > " + comment;
                if (c.Length > 35) c = c.Substring(0, 32) + "...";
                lines.Add(c);
            }

            return lines.ToArray();
        }

        private string FormatNumber(int n)
        {
            if (n >= 1000000) return (n / 1000000.0).ToString("0.#") + "M";
            if (n >= 1000) return (n / 1000.0).ToString("0.#") + "K";
            return n.ToString();
        }
    }
}
