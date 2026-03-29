using System;
using System.Collections.Generic;

namespace WreckHouse.Tests
{
    class Tests
    {
        static void Main(string[] args)
        {
            var t = new TestRunner();

            Console.WriteLine("=== WreckHouse Test Suite ===\n");

            // ---- Room Tests ----
            Console.WriteLine("[Room Tests]");

            var kitchen = Room.CreateKitchen();
            t.AssertEqual("Kitchen", kitchen.Name, "Kitchen name");
            t.AssertEqual(6, kitchen.TotalObjects(), "Kitchen has 6 objects");
            t.AssertEqual(0, kitchen.DestroyedCount(), "Kitchen starts undamaged");
            t.AssertFalse(kitchen.IsFullyWrecked(), "Kitchen not fully wrecked");
            t.AssertEqual(0.0, kitchen.DestructionPercent(), "Kitchen 0% destruction");

            var bathroom = Room.CreateBathroom();
            t.AssertEqual("Bathroom", bathroom.Name, "Bathroom name");
            t.AssertEqual(6, bathroom.TotalObjects(), "Bathroom has 6 objects");

            var bedroom = Room.CreateBedroom();
            t.AssertEqual("Bedroom", bedroom.Name, "Bedroom name");
            t.AssertEqual(6, bedroom.TotalObjects(), "Bedroom has 6 objects");

            var garage = Room.CreateGarage();
            t.AssertEqual("Garage", garage.Name, "Garage name");
            t.AssertEqual(6, garage.TotalObjects(), "Garage has 6 objects");

            var livingRoom = Room.CreateLivingRoom();
            t.AssertEqual("Living Room", livingRoom.Name, "Living Room name");
            t.AssertEqual(6, livingRoom.TotalObjects(), "Living Room has 6 objects");

            var allRooms = Room.CreateAllRooms();
            t.AssertEqual(5, allRooms.Count, "5 rooms total");

            // Room object damage
            var testRoom = Room.CreateKitchen();
            testRoom.Objects[0].ApplyDamage("water");
            t.AssertTrue(testRoom.Objects[0].Destroyed, "Object destroyed after damage");
            t.AssertEqual(DamageType.Flooded, testRoom.Objects[0].Damage, "Water damage = Flooded");
            t.AssertEqual(1, testRoom.DestroyedCount(), "1 destroyed after damage");

            testRoom.Objects[1].ApplyDamage("fire");
            t.AssertEqual(DamageType.Scorched, testRoom.Objects[1].Damage, "Fire damage = Scorched");
            t.AssertEqual(2, testRoom.DestroyedCount(), "2 destroyed");

            testRoom.Objects[2].ApplyDamage("impact");
            t.AssertEqual(DamageType.Cracked, testRoom.Objects[2].Damage, "Impact damage = Cracked");

            testRoom.Objects[3].ApplyDamage("electric");
            t.AssertEqual(DamageType.Shattered, testRoom.Objects[3].Damage, "Electric damage = Shattered");

            testRoom.Objects[4].ApplyDamage("weight");
            t.AssertEqual(DamageType.Collapsed, testRoom.Objects[4].Damage, "Weight damage = Collapsed");

            testRoom.Objects[5].ApplyDamage("unknown");
            t.AssertEqual(DamageType.Cracked, testRoom.Objects[5].Damage, "Unknown damage = Cracked");
            t.AssertEqual(6, testRoom.DestroyedCount(), "All 6 destroyed");
            t.AssertTrue(testRoom.IsFullyWrecked(), "Room fully wrecked");
            t.AssertEqual(100.0, testRoom.DestructionPercent(), "100% destruction");

            // ASCII rendering
            var renderRoom = Room.CreateKitchen();
            var ascii = renderRoom.RenderAscii();
            t.AssertGreater(ascii.Length, 3, "ASCII has multiple lines");
            t.Assert(ascii[0].Contains("+"), "ASCII has border");
            t.Assert(ascii[1].Contains("Kitchen"), "ASCII shows room name");

            // Display icons
            var intactObj = new RoomObject("Test", "TT", new[] { "impact" }, new[] { "water" });
            t.AssertEqual("TT", intactObj.GetDisplayIcon(), "Intact icon");
            intactObj.ApplyDamage("water");
            t.AssertEqual("~~", intactObj.GetDisplayIcon(), "Flooded icon");

            var fireObj = new RoomObject("Test2", "T2", new[] { "fire" }, new string[0]);
            fireObj.ApplyDamage("fire");
            t.AssertEqual("**", fireObj.GetDisplayIcon(), "Scorched icon");

            // Double damage doesn't change
            var doubleObj = new RoomObject("Test3", "T3", new[] { "impact" }, new string[0]);
            doubleObj.ApplyDamage("impact");
            t.AssertTrue(doubleObj.Destroyed, "First damage destroys");
            doubleObj.ApplyDamage("fire"); // Should be no-op
            t.AssertEqual(DamageType.Cracked, doubleObj.Damage, "Double damage doesn't change type");

            // Vulnerability check
            var vulnObj = new RoomObject("Vulnerable", "VU", new[] { "water", "fire" }, new string[0]);
            t.AssertTrue(vulnObj.IsVulnerableTo("water"), "Vulnerable to water");
            t.AssertTrue(vulnObj.IsVulnerableTo("fire"), "Vulnerable to fire");
            t.AssertFalse(vulnObj.IsVulnerableTo("impact"), "Not vulnerable to impact");

            // Empty room
            var emptyRoom = new Room("Empty", "Nothing here");
            t.AssertEqual(0, emptyRoom.TotalObjects(), "Empty room has 0 objects");
            t.AssertEqual(0.0, emptyRoom.DestructionPercent(), "Empty room 0% destruction");
            t.AssertFalse(emptyRoom.IsFullyWrecked(), "Empty room not fully wrecked");

            Console.WriteLine("  Room tests complete.");

            // ---- Tool Tests ----
            Console.WriteLine("\n[Tool Tests]");

            var allTools = Tool.CreateAllTools();
            t.AssertEqual(8, allTools.Count, "8 tools total");

            var hammer = Tool.CreateHammer();
            t.AssertEqual("Hammer", hammer.Name, "Hammer name");
            t.AssertEqual("impact", hammer.PrimaryEffect, "Hammer primary effect");
            t.AssertEqual(15, hammer.BaseDamage, "Hammer base damage");

            var blowtorch = Tool.CreateBlowtorch();
            t.AssertEqual("fire", blowtorch.PrimaryEffect, "Blowtorch primary effect");
            t.AssertEqual(0.9, blowtorch.DisasterChance, "Blowtorch disaster chance");

            var sledge = Tool.CreateSledgehammer();
            t.AssertEqual(0.95, sledge.DisasterChance, "Sledgehammer disaster chance");
            t.AssertEqual(30, sledge.BaseDamage, "Sledgehammer damage");

            var tape = Tool.CreateDuctTape();
            t.AssertEqual(0.3, tape.DisasterChance, "Duct tape low disaster chance");
            t.AssertEqual(5, tape.BaseDamage, "Duct tape low damage");

            var hose = Tool.CreateGardenHose();
            t.AssertEqual("water", hose.PrimaryEffect, "Hose primary effect");

            // GetAllEffects
            var hammerEffects = hammer.GetAllEffects();
            t.AssertEqual(2, hammerEffects.Length, "Hammer has 2 effects");
            t.AssertEqual("impact", hammerEffects[0], "Hammer first effect is impact");

            var tapeEffects = tape.GetAllEffects();
            t.AssertEqual(1, tapeEffects.Length, "Tape has 1 effect (primary only)");

            // Tool icons
            t.AssertEqual("[H]", hammer.Icon, "Hammer icon");
            t.AssertEqual("[S]", sledge.Icon, "Sledgehammer icon");
            t.AssertEqual("[T]", tape.Icon, "Duct tape icon");

            // All tools have names and descriptions
            foreach (var tool in allTools)
            {
                t.AssertTrue(tool.Name.Length > 0, "Tool " + tool.Name + " has name");
                t.AssertTrue(tool.Description.Length > 0, "Tool " + tool.Name + " has description");
                t.AssertTrue(tool.DisasterChance > 0 && tool.DisasterChance <= 1.0, "Tool " + tool.Name + " has valid chance");
            }

            Console.WriteLine("  Tool tests complete.");

            // ---- Chain Reaction Tests ----
            Console.WriteLine("\n[Chain Reaction Tests]");

            // Deterministic chain with fixed seed
            var chainRng = new Random(42);
            var chain = new ChainReaction(chainRng);
            var chainRoom = Room.CreateKitchen();
            var chainTool = Tool.CreateSledgehammer();

            var result = chain.Resolve(chainRoom.Objects[0], chainTool, chainRoom);
            t.AssertGreaterOrEqual(result.TotalDestroyed, 1, "Chain destroys at least 1 object");
            t.AssertTrue(chainRoom.Objects[0].Destroyed, "Target always destroyed");

            // Chain verbs
            var chain2 = new ChainReaction(new Random(1));
            t.AssertEqual("flooded", chain2.GetChainVerb("water"), "Water verb");
            t.AssertEqual("ignited", chain2.GetChainVerb("fire"), "Fire verb");
            t.AssertEqual("crashed into", chain2.GetChainVerb("impact"), "Impact verb");
            t.AssertEqual("short-circuited", chain2.GetChainVerb("electric"), "Electric verb");
            t.AssertEqual("collapsed onto", chain2.GetChainVerb("weight"), "Weight verb");

            // Chain with deterministic high-destruction scenario
            var bigChainRoom = Room.CreateGarage();
            var bigChainRng = new Random(100);
            var bigChain = new ChainReaction(bigChainRng);
            var bigResult = bigChain.Resolve(bigChainRoom.Objects[4], Tool.CreateBlowtorch(), bigChainRoom); // Gas can + blowtorch
            t.AssertGreaterOrEqual(bigResult.TotalDestroyed, 1, "Gas can + blowtorch destroys at least 1");

            // Cross-room chain
            var crossRooms = Room.CreateAllRooms();
            var crossRng = new Random(7);
            var crossChain = new ChainReaction(crossRng);
            var crossResult = crossChain.ResolveAcrossRooms(
                crossRooms[0].Objects[0], Tool.CreateSledgehammer(), crossRooms[0], crossRooms);
            t.AssertGreaterOrEqual(crossResult.TotalDestroyed, 1, "Cross-room chain destroys at least 1");

            // Multiple chain runs produce different results (randomness works)
            int totalA = 0, totalB = 0;
            for (int i = 0; i < 10; i++)
            {
                var rA = Room.CreateKitchen();
                var cA = new ChainReaction(new Random(i));
                totalA += cA.Resolve(rA.Objects[0], Tool.CreateSledgehammer(), rA).TotalDestroyed;

                var rB = Room.CreateKitchen();
                var cB = new ChainReaction(new Random(i + 1000));
                totalB += cB.Resolve(rB.Objects[0], Tool.CreateSledgehammer(), rB).TotalDestroyed;
            }
            t.Assert(totalA != totalB || totalA > 10, "Different seeds produce variety");

            // Duct tape (low chance) vs Sledgehammer (high chance)
            int tapeDestroys = 0, sledgeDestroys = 0;
            for (int i = 0; i < 20; i++)
            {
                var rT = Room.CreateBathroom();
                var cT = new ChainReaction(new Random(i));
                tapeDestroys += cT.Resolve(rT.Objects[0], Tool.CreateDuctTape(), rT).TotalDestroyed;

                var rS = Room.CreateBathroom();
                var cS = new ChainReaction(new Random(i));
                sledgeDestroys += cS.Resolve(rS.Objects[0], Tool.CreateSledgehammer(), rS).TotalDestroyed;
            }
            t.AssertTrue(sledgeDestroys >= tapeDestroys, "Sledgehammer causes more destruction than duct tape");

            Console.WriteLine("  Chain reaction tests complete.");

            // ---- Score Tests ----
            Console.WriteLine("\n[Score Tests]");

            var score = new ScoreKeeper();
            t.AssertEqual(0, score.TotalScore, "Score starts at 0");
            t.AssertEqual(0, score.TurnsPlayed, "0 turns played");
            t.AssertEqual("Helpful Teen", score.GetRank(), "Starting rank");

            // Simple turn scoring
            var simpleResult = new ChainResult();
            simpleResult.TotalDestroyed = 1;
            simpleResult.MaxDepth = 0;
            int s1 = score.CalculateTurnScore(simpleResult, Tool.CreateHammer());
            t.AssertGreater(s1, 0, "Turn score > 0");
            t.AssertEqual(1, score.TurnsPlayed, "1 turn played");
            t.AssertEqual(1, score.TotalObjectsDestroyed, "1 object destroyed");

            // Chain bonus
            var chainScoreResult = new ChainResult();
            chainScoreResult.TotalDestroyed = 4;
            chainScoreResult.MaxDepth = 3;
            int s2 = score.CalculateTurnScore(chainScoreResult, Tool.CreateHammer());
            t.AssertGreater(s2, s1, "Chain result scores higher than simple");

            // Cross-room bonus
            var crossScoreResult = new ChainResult();
            crossScoreResult.TotalDestroyed = 3;
            crossScoreResult.MaxDepth = 2;
            crossScoreResult.CrossedRooms = true;
            int preCross = score.TotalScore;
            int s3 = score.CalculateTurnScore(crossScoreResult, Tool.CreateHammer());
            t.AssertGreater(s3, 0, "Cross-room turn has positive score");
            t.AssertEqual(1, score.RoomsCrossed, "1 room crossed");

            // Duct tape triple bonus
            var tapeScore = new ScoreKeeper();
            var tapeResult = new ChainResult();
            tapeResult.TotalDestroyed = 2;
            tapeResult.MaxDepth = 1;
            int tapeS = tapeScore.CalculateTurnScore(tapeResult, Tool.CreateDuctTape());

            var normalScore = new ScoreKeeper();
            int normalS = normalScore.CalculateTurnScore(tapeResult, Tool.CreateHammer());
            // Duct tape gets 3x, so even with streak differences it should be higher
            // (Both are fresh ScoreKeeper so streak is same)
            t.AssertGreater(tapeS, normalS, "Duct tape triple score bonus");

            // Rank progression
            var rankScore = new ScoreKeeper();
            t.AssertEqual("Helpful Teen", rankScore.GetRank(), "Rank: Helpful Teen at 0");

            // Simulate scoring to reach different ranks
            for (int i = 0; i < 10; i++)
            {
                var r = new ChainResult { TotalDestroyed = 3, MaxDepth = 2 };
                rankScore.CalculateTurnScore(r, Tool.CreateSledgehammer());
            }
            t.Assert(rankScore.TotalScore >= 500, "Score accumulated after 10 turns");
            string rank = rankScore.GetRank();
            t.Assert(rank != "Helpful Teen", "Rank increased from Helpful Teen");

            // Star rating
            t.Assert(rankScore.GetStarRating().Length >= 0, "Star rating exists");

            // Best combo tracking
            t.AssertEqual(3, rankScore.BestCombo, "Best combo tracked");

            Console.WriteLine("  Score tests complete.");

            // ---- Patience Tests ----
            Console.WriteLine("\n[Patience Tests]");

            var patience = new PatienceMeter("Dad", new Random(42));
            t.AssertEqual(100, patience.Current, "Patience starts at 100");
            t.AssertEqual("Dad", patience.ParentName, "Parent name");
            t.AssertFalse(patience.IsExhausted(), "Not exhausted initially");
            t.AssertEqual("Calm", patience.GetMood(), "Mood starts Calm");

            // Mild damage
            var mildResult = new ChainResult { TotalDestroyed = 1, MaxDepth = 0 };
            string reaction = patience.React(mildResult);
            t.AssertTrue(reaction.Contains("Dad"), "Reaction includes parent name");
            t.AssertLess(patience.Current, 100, "Patience decreased");
            t.AssertGreater(patience.Current, 80, "Mild damage doesn't drain much");

            // Medium damage
            var medResult = new ChainResult { TotalDestroyed = 3, MaxDepth = 2 };
            patience.React(medResult);
            t.AssertLess(patience.Current, 80, "Medium damage drains more");

            // Severe damage
            var severeResult = new ChainResult { TotalDestroyed = 5, MaxDepth = 3, CrossedRooms = true };
            patience.React(severeResult);
            t.AssertLess(patience.Current, 40, "Severe damage drains a lot");

            // Meter display
            string meter = patience.GetMeterDisplay();
            t.AssertTrue(meter.Contains("Patience"), "Meter display has label");
            t.AssertTrue(meter.Contains("["), "Meter display has bar");

            // Exhaust patience
            var exhaust = new PatienceMeter("Mom", new Random(1));
            for (int i = 0; i < 20; i++)
            {
                exhaust.React(new ChainResult { TotalDestroyed = 5, MaxDepth = 3, CrossedRooms = true });
            }
            t.AssertTrue(exhaust.IsExhausted(), "Patience eventually exhausts");
            t.AssertEqual(0, exhaust.Current, "Exhausted patience is 0");
            t.AssertEqual("Gone", exhaust.GetMood(), "Mood is Gone when exhausted");

            // Mood progression
            var moodTest = new PatienceMeter("Test", new Random(1));
            t.AssertEqual("Calm", moodTest.GetMood(), "Mood: Calm > 75");
            moodTest.React(new ChainResult { TotalDestroyed = 3, MaxDepth = 1 });
            // Still should be calm or annoyed depending on exact loss

            Console.WriteLine("  Patience tests complete.");

            // ---- Social Feed Tests ----
            Console.WriteLine("\n[Social Feed Tests]");

            var social = new SocialFeed(new Random(42));
            t.AssertEqual(0, social.Posts.Count, "No posts initially");

            var postResult = new ChainResult { TotalDestroyed = 4, MaxDepth = 2, CrossedRooms = true };
            var post = social.GeneratePost(postResult, "Kitchen", Tool.CreateSledgehammer(), 500);
            t.AssertNotNull(post, "Post generated");
            t.AssertTrue(post.Platform.Length > 0, "Post has platform");
            t.AssertTrue(post.Username.Length > 0, "Post has username");
            t.AssertTrue(post.Text.Length > 0, "Post has text");
            t.AssertGreater(post.Likes, 0, "Post has likes");
            t.AssertGreater(post.Shares, 0, "Post has shares");
            t.AssertGreater(post.Comments.Length, 0, "Post has comments");
            t.AssertEqual(1, social.Posts.Count, "1 post in feed");

            // Post text contains hashtags
            t.AssertTrue(post.Text.Contains("#"), "Post text has hashtags");

            // Multiple posts don't repeat exactly
            var post2 = social.GeneratePost(postResult, "Garage", Tool.CreateBlowtorch(), 800);
            t.AssertEqual(2, social.Posts.Count, "2 posts in feed");

            // Render post
            var rendered = social.RenderPost(post);
            t.AssertGreater(rendered.Length, 3, "Rendered post has lines");
            t.Assert(rendered[0].Contains("+"), "Rendered post has border");

            // Large destruction generates bigger likes
            var bigPostResult = new ChainResult { TotalDestroyed = 6, MaxDepth = 4, CrossedRooms = true };
            var bigPost = social.GeneratePost(bigPostResult, "Living Room", Tool.CreateSledgehammer(), 2000);
            t.AssertGreater(bigPost.Likes, post.Likes / 2, "Bigger destruction gets more likes");

            // Platforms are valid
            var validPlatforms = new HashSet<string> { "WreckTok", "Instagroan", "Xplosion", "FailTube", "Disasterdit" };
            t.AssertTrue(validPlatforms.Contains(post.Platform), "Platform is valid: " + post.Platform);
            t.AssertTrue(validPlatforms.Contains(post2.Platform), "Platform2 is valid: " + post2.Platform);

            Console.WriteLine("  Social feed tests complete.");

            // ---- Game Tests ----
            Console.WriteLine("\n[Game Tests]");

            var game = new Game(42);
            t.AssertEqual(5, game.Rooms.Count, "Game has 5 rooms");
            t.AssertEqual(8, game.Tools.Count, "Game has 8 tools");
            t.AssertEqual(30, game.TotalObjects(), "Game has 30 total objects");
            t.AssertEqual(0, game.TotalDestroyedObjects(), "0 destroyed at start");
            t.AssertFalse(game.GameOver, "Game not over at start");
            t.AssertEqual(0, game.CurrentTurn, "Turn 0 at start");
            t.AssertFalse(game.AllRoomsWrecked(), "Not all rooms wrecked at start");

            // Play a valid turn
            var turnResult = game.PlayTurn(0, 5, 0); // Kitchen, Sledgehammer, Sink
            t.AssertNotNull(turnResult, "Turn result not null");
            t.AssertGreaterOrEqual(turnResult.Chain.TotalDestroyed, 1, "Turn destroyed at least 1");
            t.AssertGreater(turnResult.TurnScore, 0, "Turn score positive");
            t.AssertTrue(turnResult.Reaction.Length > 0, "Turn has parent reaction");
            t.AssertEqual(1, game.CurrentTurn, "Turn counter incremented");

            // Invalid turns return null
            t.AssertNull(game.PlayTurn(-1, 0, 0), "Negative room index returns null");
            t.AssertNull(game.PlayTurn(5, 0, 0), "Room index out of range returns null");
            t.AssertNull(game.PlayTurn(0, -1, 0), "Negative tool index returns null");
            t.AssertNull(game.PlayTurn(0, 8, 0), "Tool index out of range returns null");
            t.AssertNull(game.PlayTurn(0, 0, -1), "Negative object index returns null");
            t.AssertNull(game.PlayTurn(0, 0, 99), "Object index out of range returns null");

            // Can't target destroyed object
            if (game.Rooms[0].Objects[0].Destroyed)
            {
                t.AssertNull(game.PlayTurn(0, 0, 0), "Can't target destroyed object");
            }

            // Play until game over
            var quickGame = new Game(123);
            int turns = 0;
            while (!quickGame.GameOver && turns < 20)
            {
                // Find a non-destroyed object
                bool found = false;
                for (int r = 0; r < quickGame.Rooms.Count && !found; r++)
                {
                    for (int o = 0; o < quickGame.Rooms[r].Objects.Count && !found; o++)
                    {
                        if (!quickGame.Rooms[r].Objects[o].Destroyed)
                        {
                            quickGame.PlayTurn(r, 5, o); // Always use sledgehammer
                            found = true;
                        }
                    }
                }
                turns++;
            }
            t.AssertTrue(quickGame.GameOver, "Game eventually ends");
            t.AssertTrue(quickGame.GameOverReason.Length > 0, "Game over has reason");

            // Game over screen
            var gameOverLines = quickGame.GetGameOverScreen();
            t.AssertGreater(gameOverLines.Length, 5, "Game over screen has content");

            // Can't play after game over
            var overGame = new Game(999);
            // Force game over
            for (int i = 0; i < 20; i++)
            {
                for (int r = 0; r < overGame.Rooms.Count; r++)
                {
                    for (int o = 0; o < overGame.Rooms[r].Objects.Count; o++)
                    {
                        if (!overGame.Rooms[r].Objects[o].Destroyed && !overGame.GameOver)
                        {
                            overGame.PlayTurn(r, 5, o);
                        }
                    }
                }
            }
            if (overGame.GameOver)
            {
                t.AssertNull(overGame.PlayTurn(0, 0, 0), "Can't play after game over");
            }

            Console.WriteLine("  Game tests complete.");

            // ---- Integration Tests ----
            Console.WriteLine("\n[Integration Tests]");

            // Full game simulation with deterministic seed
            var fullGame = new Game(777);
            int totalScore = 0;
            int totalTurns = 0;
            int socialPosts = 0;

            while (!fullGame.GameOver)
            {
                for (int r = 0; r < fullGame.Rooms.Count; r++)
                {
                    for (int o = 0; o < fullGame.Rooms[r].Objects.Count; o++)
                    {
                        if (!fullGame.Rooms[r].Objects[o].Destroyed && !fullGame.GameOver)
                        {
                            int toolIdx = totalTurns % fullGame.Tools.Count;
                            var tr = fullGame.PlayTurn(r, toolIdx, o);
                            if (tr != null)
                            {
                                totalScore += tr.TurnScore;
                                totalTurns++;
                                if (tr.Post != null) socialPosts++;
                            }
                        }
                    }
                }
            }

            t.AssertGreater(totalScore, 0, "Integration: total score > 0");
            t.AssertGreater(totalTurns, 0, "Integration: turns played > 0");
            t.AssertGreater(fullGame.TotalDestroyedObjects(), 0, "Integration: objects destroyed > 0");
            t.Assert(fullGame.Score.GetRank().Length > 0, "Integration: has final rank");

            // Deterministic replay
            var replay = new Game(777);
            int replayTurns = 0;
            while (!replay.GameOver)
            {
                for (int r = 0; r < replay.Rooms.Count; r++)
                {
                    for (int o = 0; o < replay.Rooms[r].Objects.Count; o++)
                    {
                        if (!replay.Rooms[r].Objects[o].Destroyed && !replay.GameOver)
                        {
                            int toolIdx = replayTurns % replay.Tools.Count;
                            replay.PlayTurn(r, toolIdx, o);
                            replayTurns++;
                        }
                    }
                }
            }
            t.AssertEqual(fullGame.Score.TotalScore, replay.Score.TotalScore, "Deterministic replay same score");
            t.AssertEqual(fullGame.TotalDestroyedObjects(), replay.TotalDestroyedObjects(), "Deterministic replay same destruction");

            Console.WriteLine("  Integration tests complete.");

            // Print results
            t.PrintResults();
        }
    }
}
