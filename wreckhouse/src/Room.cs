using System;
using System.Collections.Generic;

namespace WreckHouse
{
    public enum DamageType
    {
        None,
        Cracked,
        Flooded,
        Scorched,
        Shattered,
        Collapsed
    }

    public class RoomObject
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public DamageType Damage { get; set; }
        public bool Destroyed { get; set; }
        public string[] Vulnerabilities { get; set; }
        public string[] ChainEffects { get; set; }

        public RoomObject(string name, string icon, string[] vulnerabilities, string[] chainEffects)
        {
            Name = name;
            Icon = icon;
            Damage = DamageType.None;
            Destroyed = false;
            Vulnerabilities = vulnerabilities;
            ChainEffects = chainEffects;
        }

        public bool IsVulnerableTo(string effectType)
        {
            foreach (var v in Vulnerabilities)
            {
                if (v == effectType) return true;
            }
            return false;
        }

        public void ApplyDamage(string effectType)
        {
            if (Destroyed) return;

            if (effectType == "water") Damage = DamageType.Flooded;
            else if (effectType == "fire") Damage = DamageType.Scorched;
            else if (effectType == "impact") Damage = DamageType.Cracked;
            else if (effectType == "electric") Damage = DamageType.Shattered;
            else if (effectType == "weight") Damage = DamageType.Collapsed;
            else Damage = DamageType.Cracked;

            Destroyed = true;
        }

        public string GetDisplayIcon()
        {
            if (!Destroyed) return Icon;
            switch (Damage)
            {
                case DamageType.Flooded: return "~~";
                case DamageType.Scorched: return "**";
                case DamageType.Cracked: return "//";
                case DamageType.Shattered: return "##";
                case DamageType.Collapsed: return "vv";
                default: return "XX";
            }
        }
    }

    public class Room
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<RoomObject> Objects { get; set; }

        public Room(string name, string description)
        {
            Name = name;
            Description = description;
            Objects = new List<RoomObject>();
        }

        public int DestroyedCount()
        {
            int count = 0;
            foreach (var obj in Objects)
            {
                if (obj.Destroyed) count++;
            }
            return count;
        }

        public int TotalObjects()
        {
            return Objects.Count;
        }

        public double DestructionPercent()
        {
            if (Objects.Count == 0) return 0;
            return (double)DestroyedCount() / Objects.Count * 100.0;
        }

        public bool IsFullyWrecked()
        {
            return Objects.Count > 0 && DestroyedCount() == Objects.Count;
        }

        public string[] RenderAscii()
        {
            var lines = new List<string>();
            lines.Add("+---------------------------+");
            lines.Add("|  " + Name.PadRight(25) + "|");
            lines.Add("+---------------------------+");

            for (int i = 0; i < Objects.Count; i += 3)
            {
                string line = "|  ";
                for (int j = i; j < i + 3 && j < Objects.Count; j++)
                {
                    var obj = Objects[j];
                    line += "[" + obj.GetDisplayIcon() + "] ";
                }
                line = line.PadRight(30) + "|";
                lines.Add(line);
            }

            lines.Add("+---------------------------+");
            return lines.ToArray();
        }

        public static Room CreateKitchen()
        {
            var room = new Room("Kitchen", "Mom's pride and joy. Full of breakable things.");
            room.Objects.Add(new RoomObject("Sink", "SK", new[] { "impact", "weight" }, new[] { "water" }));
            room.Objects.Add(new RoomObject("Oven", "OV", new[] { "water", "impact" }, new[] { "fire" }));
            room.Objects.Add(new RoomObject("Fridge", "FR", new[] { "fire", "electric" }, new[] { "water", "electric" }));
            room.Objects.Add(new RoomObject("Cabinet", "CB", new[] { "impact", "water", "fire" }, new[] { "weight" }));
            room.Objects.Add(new RoomObject("Window", "WN", new[] { "impact", "weight" }, new[] { "impact" }));
            room.Objects.Add(new RoomObject("Light", "LT", new[] { "water", "impact" }, new[] { "electric", "fire" }));
            return room;
        }

        public static Room CreateBathroom()
        {
            var room = new Room("Bathroom", "Tiles, pipes, and mirrors. What could go wrong?");
            room.Objects.Add(new RoomObject("Toilet", "TL", new[] { "impact", "weight" }, new[] { "water" }));
            room.Objects.Add(new RoomObject("Mirror", "MR", new[] { "impact", "water" }, new[] { "impact" }));
            room.Objects.Add(new RoomObject("Bathtub", "BT", new[] { "impact", "weight" }, new[] { "water" }));
            room.Objects.Add(new RoomObject("Pipe", "PP", new[] { "impact", "fire" }, new[] { "water" }));
            room.Objects.Add(new RoomObject("Tiles", "TI", new[] { "impact", "water", "weight" }, new[] { "impact" }));
            room.Objects.Add(new RoomObject("Heater", "HT", new[] { "water", "impact" }, new[] { "fire", "electric" }));
            return room;
        }

        public static Room CreateBedroom()
        {
            var room = new Room("Bedroom", "Your room. At least it WAS your room.");
            room.Objects.Add(new RoomObject("Bed", "BD", new[] { "fire", "water" }, new[] { "weight" }));
            room.Objects.Add(new RoomObject("Desk", "DK", new[] { "fire", "impact", "water" }, new[] { "weight", "impact" }));
            room.Objects.Add(new RoomObject("Lamp", "LP", new[] { "impact", "water" }, new[] { "electric", "fire" }));
            room.Objects.Add(new RoomObject("Shelf", "SH", new[] { "impact", "weight" }, new[] { "weight", "impact" }));
            room.Objects.Add(new RoomObject("PC", "PC", new[] { "water", "electric", "impact" }, new[] { "electric", "fire" }));
            room.Objects.Add(new RoomObject("Poster", "PS", new[] { "fire", "water" }, new[] { "fire" }));
            return room;
        }

        public static Room CreateGarage()
        {
            var room = new Room("Garage", "Dad's workshop. Touch nothing. (You will touch everything.)");
            room.Objects.Add(new RoomObject("Workbench", "WB", new[] { "fire", "impact" }, new[] { "weight", "impact" }));
            room.Objects.Add(new RoomObject("Paint Cans", "PC", new[] { "fire", "impact" }, new[] { "fire" }));
            room.Objects.Add(new RoomObject("Power Tools", "PT", new[] { "water", "impact" }, new[] { "electric", "impact" }));
            room.Objects.Add(new RoomObject("Car", "CR", new[] { "impact", "fire" }, new[] { "fire", "impact", "weight" }));
            room.Objects.Add(new RoomObject("Gas Can", "GC", new[] { "fire", "electric" }, new[] { "fire" }));
            room.Objects.Add(new RoomObject("Ladder", "LD", new[] { "impact", "weight" }, new[] { "weight", "impact" }));
            return room;
        }

        public static Room CreateLivingRoom()
        {
            var room = new Room("Living Room", "The fancy room guests see. Not for long.");
            room.Objects.Add(new RoomObject("TV", "TV", new[] { "impact", "water", "electric" }, new[] { "electric", "fire" }));
            room.Objects.Add(new RoomObject("Sofa", "SF", new[] { "fire", "water" }, new[] { "fire" }));
            room.Objects.Add(new RoomObject("Bookshelf", "BS", new[] { "impact", "fire", "weight" }, new[] { "weight", "impact" }));
            room.Objects.Add(new RoomObject("Chandelier", "CH", new[] { "impact", "electric" }, new[] { "electric", "impact", "weight" }));
            room.Objects.Add(new RoomObject("Fireplace", "FP", new[] { "water" }, new[] { "fire" }));
            room.Objects.Add(new RoomObject("Aquarium", "AQ", new[] { "impact", "electric" }, new[] { "water" }));
            return room;
        }

        public static List<Room> CreateAllRooms()
        {
            return new List<Room>
            {
                CreateKitchen(),
                CreateBathroom(),
                CreateBedroom(),
                CreateGarage(),
                CreateLivingRoom()
            };
        }
    }
}
