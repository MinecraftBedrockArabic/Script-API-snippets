import { system } from "@minecraft/server";
import { StructureDetector } from "./structureDetector.js";


/**
 * Used for debugging patterns.
 * /scriptevent test:place_patterns <patternNumber: int> [autoTrigger: bool] [spacing: int]
 * Only run the function once in your script
 * @function
 */
function patternDebugger() {
    system.afterEvents.scriptEventReceive.subscribe((eventData) => {
        const { id, sourceEntity, message } = eventData;
        if (sourceEntity?.typeId !== "minecraft:player" || !id) return
        if (id === "test:place_patterns" && message) {
            const args = message.split(" ");
            if (args.length === 0) return
            if (args.length < 2) args.push("false")
            if (args.length < 3) args.push("7")

            const num = args[0]
            const autoTrigger = args[1] === "true" ? true : args[1] === "false" ? false : undefined
            if (isNaN(num) || autoTrigger === undefined || isNaN(args[2])) return;

            const { x, y, z } = sourceEntity.location;
            const dimension = sourceEntity.dimension;

            const detectors = StructureDetector.instances
            const id = Number(num)
            if (id > detectors.length) return
            placeTestPatterns(dimension, { x: x + 5, y, z }, detectors[id], autoTrigger, args[2]);
        } else if (id === "test:syntax") {
            sourceEntity.sendMessage("§2Command syntax for Debugging pattern placement is:")
            sourceEntity.sendMessage("§7/scriptevent test:place_patterns §c<patternNumber: int> §6[autoTrigger: bool] §9[spacing: int]§r");
        }
    });


    function placeTestPatterns(dimension, startPos, detector, autoTrigger, spacing) {
        const { patternTypes, transformedPatterns } = detector
        const patternPertick = autoTrigger ? 1 : 3

        let placements = [];
        transformedPatterns.forEach((pattern, patternIndex) => {
            let pumpkinPositions = [];
            for (let y = 0; y < pattern.length; y++) {
                for (let z = 0; z < pattern[y].length; z++) {
                    for (let x = 0; x < pattern[y][z].length; x++) {
                        if (patternTypes[pattern[y][z][x]] === patternTypes.p) {
                            pumpkinPositions.push({ x, y, z });
                        }
                    }
                }
            }

            pumpkinPositions.forEach((skipPos, variationIndex) => {
                const gridX = Math.floor((patternIndex * pumpkinPositions.length + variationIndex) / 8);
                const gridZ = (patternIndex * pumpkinPositions.length + variationIndex) % 8;

                placements.push({
                    pos: {
                        x: startPos.x + (gridX * spacing),
                        y: startPos.y,
                        z: startPos.z + (gridZ * spacing)
                    },
                    pattern: pattern,
                    skipPos: skipPos,
                });
            });
        });

        function placeNextPatterns() {
            const currentPlacements = placements.splice(0, patternPertick);
            if (currentPlacements.length === 0) {
                return;
            }

            for (const placement of currentPlacements) {
                const pattern = placement.pattern;

                for (let y = 0; y < pattern.length; y++) {
                    for (let z = 0; z < pattern[y].length; z++) {
                        for (let x = 0; x < pattern[y][z].length; x++) {
                            const blockType = patternTypes[pattern[y][z][x]];
                            if (blockType === undefined) {

                                dimension.getBlock({
                                    x: placement.pos.x + x,
                                    y: placement.pos.y + y,
                                    z: placement.pos.z + z
                                })?.setType("minecraft:air");
                                continue
                            };

                            if (blockType === patternTypes.p &&
                                x === placement.skipPos.x &&
                                y === placement.skipPos.y &&
                                z === placement.skipPos.z) {
                                const b = dimension.getBlock({
                                    x: placement.pos.x + x,
                                    y: placement.pos.y + y,
                                    z: placement.pos.z + z
                                })
                                if (autoTrigger) {
                                    b?.setType(blockType);
                                    system.runTimeout(() => detector.detectStructure(dimension, b), 2);
                                } else b?.setType("minecraft:air");
                                continue;
                            }

                            const pos = {
                                x: placement.pos.x + x,
                                y: placement.pos.y + y,
                                z: placement.pos.z + z
                            };

                            dimension.getBlock(pos)?.setType(blockType);
                        }
                    }
                }

            }

            if (placements.length > 0) {
                system.runTimeout(placeNextPatterns, autoTrigger ? 5 : 1);
            }
        }

        system.runTimeout(placeNextPatterns, autoTrigger ? 5 : 1);
    }
}

export { patternDebugger };