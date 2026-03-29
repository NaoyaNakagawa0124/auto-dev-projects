using System;
using System.Collections.Generic;

namespace WreckHouse
{
    public class ChainEvent
    {
        public RoomObject Source { get; set; }
        public RoomObject Target { get; set; }
        public string EffectType { get; set; }
        public string Description { get; set; }
        public int Depth { get; set; }

        public ChainEvent(RoomObject source, RoomObject target, string effectType, string description, int depth)
        {
            Source = source;
            Target = target;
            EffectType = effectType;
            Description = description;
            Depth = depth;
        }
    }

    public class ChainResult
    {
        public List<ChainEvent> Events { get; set; }
        public int TotalDestroyed { get; set; }
        public int MaxDepth { get; set; }
        public bool CrossedRooms { get; set; }

        public ChainResult()
        {
            Events = new List<ChainEvent>();
            TotalDestroyed = 0;
            MaxDepth = 0;
            CrossedRooms = false;
        }
    }

    public class ChainReaction
    {
        private static readonly string[] Verbs = new[]
        {
            "exploded", "shattered", "flooded", "ignited", "collapsed",
            "launched into", "ricocheted off", "cascaded onto", "melted",
            "short-circuited", "crashed through", "toppled onto"
        };

        private Random rng;

        public ChainReaction(Random rng)
        {
            this.rng = rng;
        }

        public ChainReaction() : this(new Random()) { }

        public string GetChainVerb(string effectType)
        {
            if (effectType == "water") return "flooded";
            if (effectType == "fire") return "ignited";
            if (effectType == "impact") return "crashed into";
            if (effectType == "electric") return "short-circuited";
            if (effectType == "weight") return "collapsed onto";
            return Verbs[rng.Next(Verbs.Length)];
        }

        public ChainResult Resolve(RoomObject target, Tool tool, Room room)
        {
            var result = new ChainResult();
            var queue = new Queue<Tuple<RoomObject, string, int>>();

            // Initial hit
            if (!target.Destroyed)
            {
                target.ApplyDamage(tool.PrimaryEffect);
                result.TotalDestroyed++;
            }

            // Queue chain effects from target
            foreach (var effect in target.ChainEffects)
            {
                queue.Enqueue(Tuple.Create(target, effect, 1));
            }

            // Also queue bonus effects from the tool
            foreach (var effect in tool.BonusEffects)
            {
                queue.Enqueue(Tuple.Create(target, effect, 1));
            }

            var destroyed = new HashSet<string>();
            destroyed.Add(target.Name);

            int maxDepth = 0;

            while (queue.Count > 0 && maxDepth < 5)
            {
                var item = queue.Dequeue();
                var source = item.Item1;
                var effectType = item.Item2;
                int depth = item.Item3;

                if (depth > 5) continue;
                if (depth > maxDepth) maxDepth = depth;

                foreach (var obj in room.Objects)
                {
                    if (destroyed.Contains(obj.Name)) continue;
                    if (!obj.IsVulnerableTo(effectType)) continue;

                    // Probability decreases with depth
                    double chance = tool.DisasterChance * (1.0 - depth * 0.15);
                    if (rng.NextDouble() > chance) continue;

                    string verb = GetChainVerb(effectType);
                    string desc = source.Name + " " + verb + " the " + obj.Name + "!";

                    obj.ApplyDamage(effectType);
                    destroyed.Add(obj.Name);
                    result.TotalDestroyed++;

                    result.Events.Add(new ChainEvent(source, obj, effectType, desc, depth));

                    // Propagate chain effects from newly destroyed object
                    foreach (var nextEffect in obj.ChainEffects)
                    {
                        queue.Enqueue(Tuple.Create(obj, nextEffect, depth + 1));
                    }
                }
            }

            result.MaxDepth = maxDepth;
            return result;
        }

        public ChainResult ResolveAcrossRooms(RoomObject target, Tool tool, Room primaryRoom, List<Room> allRooms)
        {
            var result = Resolve(target, tool, primaryRoom);

            // If chain is deep enough, spread to adjacent rooms
            if (result.MaxDepth >= 2 && result.TotalDestroyed >= 3)
            {
                foreach (var room in allRooms)
                {
                    if (room.Name == primaryRoom.Name) continue;
                    if (room.IsFullyWrecked()) continue;

                    // 30% chance to spread to adjacent room
                    if (rng.NextDouble() > 0.3) continue;

                    result.CrossedRooms = true;
                    var lastEvent = result.Events.Count > 0 ? result.Events[result.Events.Count - 1] : null;
                    string spreadEffect = lastEvent != null ? lastEvent.EffectType : tool.PrimaryEffect;

                    foreach (var obj in room.Objects)
                    {
                        if (obj.Destroyed) continue;
                        if (!obj.IsVulnerableTo(spreadEffect)) continue;

                        string desc = "The disaster spread to " + room.Name + "! " + obj.Name + " is hit!";
                        obj.ApplyDamage(spreadEffect);
                        result.TotalDestroyed++;
                        result.Events.Add(new ChainEvent(null, obj, spreadEffect, desc, result.MaxDepth + 1));
                        break; // Only one object per adjacent room
                    }
                }
            }

            return result;
        }
    }
}
