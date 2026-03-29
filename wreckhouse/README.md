# WreckHouse

The anti-House Flipper. A terminal-based C# game where you're a bored teenager forced to help with home renovation -- and everything goes catastrophically wrong.

## Concept

Every renovation game makes things beautiful. WreckHouse makes things explode. Pick a room, choose a tool, attempt a renovation task, and watch chain-reaction disasters unfold in glorious ASCII art. Score points for creative destruction while your parent's patience meter drains.

## Features

- 5 rooms to "renovate" (Kitchen, Bathroom, Bedroom, Garage, Living Room)
- 8 tools with unique disaster potential (hammer, paint roller, drill, etc.)
- Chain-reaction physics: one broken pipe floods the kitchen, which shorts the electrics, which starts a fire
- Patience meter: your parent watches and reacts to each disaster
- Destruction score with combos and multipliers
- Fake social media posting of your best disasters
- ASCII art room rendering with damage states

## Tech Stack

- C# / Mono
- Terminal rendering with ANSI escape codes
- Compiled with `mcs`, run with `mono`

## How to Run

```bash
mcs -out:wreckhouse.exe src/*.cs && mono wreckhouse.exe
```

## How to Test

```bash
mcs -out:tests.exe tests/*.cs src/Room.cs src/Tool.cs src/Chain.cs src/Score.cs src/Patience.cs src/Social.cs && mono tests.exe
```
