import { world } from "@minecraft/server";
import { StructureDetector } from "./structureDetector.js";
import {patternDebugger} from "./debugger.js";


// Example usage:
const detector = new StructureDetector(
    {
        "*": undefined,
        "a": "minecraft:air",
        "s": "minecraft:stone",
        "p": "minecraft:pumpkin"
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

const detector2 = new StructureDetector(
    {
        "*": undefined,
        "a": "minecraft:air",
        "d": "minecraft:dirt",
        "p": "minecraft:pumpkin"
    },
    [
        ["ada"],
        ["ddd"],
        ["ppp"]
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

patternDebugger()