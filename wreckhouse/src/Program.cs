using System;
using System.Collections.Generic;

namespace WreckHouse
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Clear();
            PrintTitle();

            var game = new Game();

            while (!game.GameOver)
            {
                PrintStatus(game);
                PrintRoomSelection(game);

                Console.Write("\nPick a room (1-5): ");
                string roomInput = Console.ReadLine();
                if (roomInput == null || roomInput.ToLower() == "q") break;
                int roomIdx;
                if (!int.TryParse(roomInput, out roomIdx) || roomIdx < 1 || roomIdx > 5)
                {
                    Console.WriteLine("Invalid room! Try 1-5.");
                    continue;
                }
                roomIdx--;

                var room = game.Rooms[roomIdx];
                if (room.IsFullyWrecked())
                {
                    Console.WriteLine("That room is already fully wrecked! Pick another.");
                    continue;
                }

                PrintRoomView(room);
                PrintObjectSelection(room);

                Console.Write("Pick an object (1-" + room.Objects.Count + "): ");
                string objInput = Console.ReadLine();
                int objIdx;
                if (!int.TryParse(objInput, out objIdx) || objIdx < 1 || objIdx > room.Objects.Count)
                {
                    Console.WriteLine("Invalid object!");
                    continue;
                }
                objIdx--;

                if (room.Objects[objIdx].Destroyed)
                {
                    Console.WriteLine("That's already destroyed!");
                    continue;
                }

                PrintToolSelection(game);

                Console.Write("Pick a tool (1-" + game.Tools.Count + "): ");
                string toolInput = Console.ReadLine();
                int toolIdx;
                if (!int.TryParse(toolInput, out toolIdx) || toolIdx < 1 || toolIdx > game.Tools.Count)
                {
                    Console.WriteLine("Invalid tool!");
                    continue;
                }
                toolIdx--;

                // Play the turn
                Console.WriteLine();
                Console.WriteLine("You grab the " + game.Tools[toolIdx].Name + " and aim at the " + room.Objects[objIdx].Name + "...");
                Console.WriteLine();

                var result = game.PlayTurn(roomIdx, toolIdx, objIdx);
                if (result == null)
                {
                    Console.WriteLine("Something went wrong!");
                    continue;
                }

                // Show chain reaction
                Console.WriteLine("  WHACK! The " + room.Objects[objIdx].Name + " takes a hit!");
                foreach (var evt in result.Chain.Events)
                {
                    Console.WriteLine("  >> " + evt.Description);
                }

                Console.WriteLine();
                Console.WriteLine("  Destroyed: " + result.Chain.TotalDestroyed + " objects | Chain depth: " + result.Chain.MaxDepth);
                Console.WriteLine("  Turn score: +" + result.TurnScore);
                Console.WriteLine();

                // Parent reaction
                Console.WriteLine("  " + result.Reaction);
                Console.WriteLine("  " + game.Patience.GetMeterDisplay());
                Console.WriteLine();

                // Social post
                if (result.Post != null)
                {
                    Console.WriteLine("  [VIRAL MOMENT!]");
                    var postLines = game.Social.RenderPost(result.Post);
                    foreach (var line in postLines)
                    {
                        Console.WriteLine("  " + line);
                    }
                    Console.WriteLine();
                }

                // Updated room view
                PrintRoomView(room);

                if (result.IsGameOver)
                {
                    var gameOverLines = game.GetGameOverScreen();
                    foreach (var line in gameOverLines)
                    {
                        Console.WriteLine(line);
                    }
                }
                else
                {
                    Console.WriteLine("Press Enter to continue...");
                    Console.ReadLine();
                }
            }

            if (!game.GameOver)
            {
                Console.WriteLine("\nYou quit! Final score: " + game.Score.TotalScore);
            }
        }

        static void PrintTitle()
        {
            Console.WriteLine(@"
 __        __         _    _   _
 \ \      / / __ ___|  | | | | | ___  _   _ ___  ___
  \ \ /\ / / '__/ _ \ |_| |_| |/ _ \| | | / __|/ _ \
   \ V  V /| | |  __/ __|  _  | (_) | |_| \__ \  __/
    \_/\_/ |_|  \___|\___|_| |_|\___/ \__,_|___/\___|

  The Anti-House-Flipper | Renovation Disaster Simulator

  You're a bored teen forced to help with home renovation.
  Everything you touch will go horribly wrong.
  Score points for creative destruction!

  Controls: Type numbers to select, 'q' to quit.
");
        }

        static void PrintStatus(Game game)
        {
            Console.WriteLine("=== Turn " + (game.CurrentTurn + 1) + "/" + game.MaxTurns +
                " | Score: " + game.Score.TotalScore +
                " | " + game.Patience.GetMood() +
                " | Destroyed: " + game.TotalDestroyedObjects() + "/" + game.TotalObjects() + " ===");
        }

        static void PrintRoomSelection(Game game)
        {
            Console.WriteLine("\nRooms:");
            for (int i = 0; i < game.Rooms.Count; i++)
            {
                var room = game.Rooms[i];
                string status = room.IsFullyWrecked() ? " [WRECKED]" :
                    " (" + room.DestroyedCount() + "/" + room.TotalObjects() + " destroyed)";
                Console.WriteLine("  " + (i + 1) + ". " + room.Name + status);
            }
        }

        static void PrintRoomView(Room room)
        {
            Console.WriteLine();
            var ascii = room.RenderAscii();
            foreach (var line in ascii) Console.WriteLine("  " + line);
            Console.WriteLine();
        }

        static void PrintObjectSelection(Room room)
        {
            Console.WriteLine("Objects:");
            for (int i = 0; i < room.Objects.Count; i++)
            {
                var obj = room.Objects[i];
                string status = obj.Destroyed ? " [DESTROYED - " + obj.Damage + "]" : "";
                Console.WriteLine("  " + (i + 1) + ". " + obj.Name + " " + obj.GetDisplayIcon() + status);
            }
        }

        static void PrintToolSelection(Game game)
        {
            Console.WriteLine("\nTools:");
            for (int i = 0; i < game.Tools.Count; i++)
            {
                var tool = game.Tools[i];
                Console.WriteLine("  " + (i + 1) + ". " + tool.Name + " " + tool.Icon + " - " + tool.Description);
                Console.WriteLine("       Disaster chance: " + (tool.DisasterChance * 100) + "% | Damage: " + tool.BaseDamage);
            }
        }
    }
}
