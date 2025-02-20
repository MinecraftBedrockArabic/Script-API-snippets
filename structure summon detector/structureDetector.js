import { system } from "@minecraft/server";

/**
 * Detects patterns in a structure and summons an entity at the first occurrence of the pattern
 * @type {StructureDetector}
 * @constructor
 * @param {Object} patternTypes - An object where each key is a character and each value is the corresponding block type
 * @param {Array} basePattern - A 3D array representing the base pattern to detect
 * @param {Function} summonEntity - A function that summons an entity at a given position
 * @param {number} blockPerRun -Optional: The number of blocks to check per run. 
 */
class StructureDetector {
    constructor(patternTypes, basePattern, summonEntity, blockPerRun = 10) {
        this.patternTypes = patternTypes;
        this.basePattern = basePattern;
        this.triggerBlock = this.patternTypes[Object.keys(this.patternTypes).pop()];
        this.transformedPatterns = this.generateAllTransformations();
        this.transformedPatterns = this.generateAllTransformations();
        this.summonEntity = summonEntity;
        this.blockPerRun = blockPerRun;
        StructureDetector.instances.push(this);
    }

    static instances = [];

    generateAllTransformations() {
        const transformations = new Set();
        const baseTransforms = [
            this.basePattern,
            StructureDetector.flipEntirePattern(this.basePattern),
            StructureDetector.transposeYZ(this.basePattern),
            StructureDetector.transposeXY(this.basePattern)
        ];

        for (let current of baseTransforms) {
            for (let i = 0; i < 4; i++) {
                transformations.add(JSON.stringify(current));
                transformations.add(JSON.stringify(current.map(layer => StructureDetector.flipLayerHorizontal(layer))));
                transformations.add(JSON.stringify(current.map(layer => StructureDetector.flipLayerVertical(layer))));
                current = current.map(layer => StructureDetector.rotateLayer(layer));
            }
        }

        return Array.from(transformations).map(JSON.parse);
    }

    detectStructure(dimension, block) {
        if (block.typeId !== this.triggerBlock) return;
        for (const transformed of this.transformedPatterns) {
            const dims = this.getPatternDimensions(transformed);
            const searchArea = {
                minX: -dims.width,
                maxX: dims.width,
                minY: -dims.height,
                maxY: dims.height,
                minZ: -dims.depth,
                maxZ: dims.depth
            };
            system.runJob(this.checkPositionsJob(dimension, block, transformed, searchArea));
        }
    }

    *checkPositionsJob(dimension, block, transformed, searchArea) {
        const state = { isDone: false };
        for (let dx = searchArea.minX; dx <= searchArea.maxX; dx++) {
            for (let dy = searchArea.minY; dy <= searchArea.maxY; dy++) {
                for (let dz = searchArea.minZ; dz <= searchArea.maxZ; dz++) {
                    const pos = {
                        x: Math.floor(block.location.x + dx),
                        y: Math.floor(block.location.y + dy),
                        z: Math.floor(block.location.z + dz)
                    };
                    if (!this.isValidTriggerPosition(block, pos, transformed)) continue;
                    system.runJob(this.checkStructureJob(dimension, pos, transformed, state));
                    yield;
                }
                yield;
            }
        }
    }

    getPatternDimensions(pattern) {
        return {
            width: pattern[0][0].length,
            height: pattern.length,
            depth: pattern[0].length
        };
    }


    isValidTriggerPosition(block, origin, pattern) {
        for (let y = 0; y < pattern.length; y++) {
            for (let z = 0; z < pattern[y].length; z++) {
                for (let x = 0; x < pattern[y][z].length; x++) {
                    if (this.patternTypes[pattern[y][z][x]] === this.triggerBlock &&
                        block.location.x === origin.x + x &&
                        block.location.y === origin.y + y &&
                        block.location.z === origin.z + z) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    *checkStructureJob(dimension, origin, pattern, state) {
        let count = 0;
        for (let y = 0; y < pattern.length; y++) {
            for (let z = 0; z < pattern[y].length; z++) {
                for (let x = 0; x < pattern[y][z].length; x++) {
                    const expected = this.patternTypes[pattern[y][z][x]];
                    if (!expected) continue;

                    const pos = {
                        x: origin.x + x,
                        y: origin.y + y,
                        z: origin.z + z
                    };

                    if (dimension.getBlock(pos)?.typeId !== expected) return;
                    if (++count >= this.blockPerRun) yield (count = 0);
                }
            }
        }
        if (state.isDone) return;
        state.isDone = true;
        system.runJob(this.removeStructureChunkedJob(dimension, origin, pattern));
        this.summonEntity(dimension, origin);
    }

    *removeStructureChunkedJob(dimension, origin, pattern) {
        let count = 0;
        for (let y = 0; y < pattern.length; y++) {
            for (let z = 0; z < pattern[y].length; z++) {
                for (let x = 0; x < pattern[y][z].length; x++) {
                    if (this.patternTypes[pattern[y][z][x]]) {
                        dimension.getBlock({
                            x: origin.x + x,
                            y: origin.y + y,
                            z: origin.z + z
                        })?.setType("minecraft:air");
                        if (++count >= this.blockPerRun) yield (count = 0);
                    }
                }
            }
        }
    }

    static rotateLayer(layer) {
        const rotated = [];
        for (let col = 0; col < layer[0].length; col++) {
            let rowStr = "";
            for (let row = layer.length - 1; row >= 0; row--) {
                rowStr += layer[row][col];
            }
            rotated.push(rowStr);
        }
        return rotated;
    }

    static flipLayerHorizontal(layer) {
        return layer.map(row => row.split('').reverse().join(''));
    }

    static flipLayerVertical(layer) {
        return layer.reverse();
    }

    static flipEntirePattern(pattern) {
        return pattern.map(layer => StructureDetector.flipLayerVertical(layer)).reverse();
    }

    static transposeYZ(pattern) {
        const transposed = [];
        for (let z = 0; z < pattern[0].length; z++) {
            const layer = [];
            for (let y = 0; y < pattern.length; y++) {
                layer.push(([...pattern[y][z]]).join(''));
            }
            transposed.push(layer);
        }
        return transposed;
    }

    static transposeXY(pattern) {
        const transposed = [];
        for (let y = 0; y < pattern.length; y++) {
            const layer = [];
            for (let x = 0; x < pattern[0][0].length; x++) {
                let row = "";
                for (let z = 0; z < pattern[0].length; z++) {
                    row += pattern[y][z][x];
                }
                layer.push(row);
            }
            transposed.push(layer);
        }
        return transposed;
    }
}

export { StructureDetector };