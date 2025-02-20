# Structure Summon Detector

A Minecraft Bedrock Edition script that allows you to detect specific block patterns and trigger entity summons when those patterns are completed.

## Features

- Supports both 2D and 3D structure patterns
- Automatically handles all oriantations
- Debug mode for testing patterns
- Configurable block detection rate

## How It Works

The Structure Summon Detector works by monitoring block placements and checking for specific patterns when a trigger block is placed. When a matching pattern is found, it executes a custom function to summon an entity (or do something else).

## Usage Examples

### 1. Basic 2D Pattern (Wither-like Structure)

```javascript
const detector = new StructureDetector(
    {
        "*": undefined, // any block
        "a": "minecraft:air",
        "s": "minecraft:stone",
        "p": "minecraft:pumpkin" // Trigger block
    },
    [
        ["asa"], //layer 1
        ["sss"], //layer 2
        ["ppp"]  //layer 3
    ],
    (dimension, pos) => {
        const entity = dimension.spawnEntity("minecraft:zombie", pos);
        entity.nameTag = "Summoned Zombie";
    }
);
```

<img src="https://raw.githubusercontent.com/MinecraftBedrockArabic/Script-API-snippets/main/structure%20summon%20detector/pic/2D.png" alt="preview" width="100">

### 2. 3D Pattern Example

```javascript
const detector2 = new StructureDetector(
    {
        "*": undefined,
        "a": "minecraft:air",
        "d": "minecraft:dirt",
        "p": "minecraft:pumpkin"
    },
    [
        [
            "aaa",
            "ada",
            "aaa",
        ],
        [
            "ada",
            "ddd",
            "ada",
        ],
        [
            "aaa",
            "apa",
            "aaa",
        ]
    ],
    (dimension, pos) => {
        const entity = dimension.spawnEntity("minecraft:zombie_villager", pos);
        entity.nameTag = "Summoned Zombie Villager";
    }
);
```

<img src="https://raw.githubusercontent.com/MinecraftBedrockArabic/Script-API-snippets/main/structure%20summon%20detector/pic/3D.png" alt="preview" width="100">

## Debug Commands

<img src="https://raw.githubusercontent.com/MinecraftBedrockArabic/Script-API-snippets/main/structure%20summon%20detector/pic/all.png" alt="preview" width="200">

To help with testing and visualization, the script includes debug commands:

```
/scriptevent test:place_patterns <patternNumber> [autoTrigger] [spacing]
```

Parameters:
- `patternNumber`: The index of the pattern to test
- `autoTrigger`: (Optional) Boolean to auto-trigger the pattern
- `spacing`: (Optional) Spacing between test patterns

To see command syntax:
```
/scriptevent test:syntax
```

## Implementation Guide

1. Import the necessary modules:
```javascript
import { world } from "@minecraft/server";
import { StructureDetector } from "./structureDetector.js";
```

2. Define your pattern and create a detector:
```javascript
const detector = new StructureDetector(
    patternTypes,    // Block type definitions
    pattern,         // Pattern array
    summonCallback   // Function to call when pattern is detected
);
```

3. Register the event listener:
```javascript
world.afterEvents.playerPlaceBlock.subscribe(({ block, dimension }) => {
    detector.detectStructure(dimension, block);
});
```

## Performance Considerations

- The script uses a job system to spread block checking over multiple ticks
- Default block check rate is 10 blocks per run
- Pattern transformations are pre-calculated for efficiency

## API Reference

### StructureDetector Class

```typescript
class StructureDetector {
    constructor(
        patternTypes: Object,    // Block type definitions
        basePattern: Array,      // Pattern array
        summonEntity: Function,  // Callback function
        blockPerRun?: number    // Optional: blocks to check per run
    );
}
```

### Pattern Types Object

The pattern types object uses single characters as keys and block IDs as values:
```javascript
{
    "*": undefined,         // Wildcard (any block)
    "a": "minecraft:air",   // Air block
    "p": "minecraft:pumpkin" // Trigger block (must be last)
}
```

## Requirements

- Minecraft Bedrock Edition
- Stable Script API

## License

This script is provided as-is under standard open-source terms.
