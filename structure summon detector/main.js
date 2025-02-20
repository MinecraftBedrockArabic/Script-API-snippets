import { world } from "@minecraft/server";
import { StructureDetector } from "./structureDetector.js";
import {patternDebugger} from "./debugger.js";


// Example usage:

// 2D pattern (like the vanilla wither boss)
const detector = new StructureDetector(
    {
        "*": undefined,
        "a": "minecraft:air",
        "s": "minecraft:stone",
        "p": "minecraft:pumpkin" // the block that tigger the check.
    },
    [
        ["asa"],
        ["sss"],
        ["ppp"]
    ],
    (dimension, pos) => {
        const entity = dimension.spawnEntity("minecraft:zombie", pos);
        entity.nameTag = "Summoned Zombie";
    }
);

// 3D pattern
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


world.afterEvents.playerPlaceBlock.subscribe(({ block, dimension }) => {
    detector.detectStructure(dimension, block);
    detector2.detectStructure(dimension, block);
});

//Turn on the debugger
patternDebugger()