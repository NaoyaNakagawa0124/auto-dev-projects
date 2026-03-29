# WreckHouse

C# terminal game compiled with Mono (`mcs`/`mono`).

## Build & Run
```bash
mcs -out:wreckhouse.exe src/*.cs && mono wreckhouse.exe
```

## Test
```bash
mcs -out:tests.exe tests/TestRunner.cs tests/Tests.cs src/Room.cs src/Tool.cs src/Chain.cs src/Score.cs src/Patience.cs src/Social.cs && mono tests.exe
```

## Conventions
- One class per file in src/
- Test file mirrors source file naming
- No external dependencies - pure Mono/C#
