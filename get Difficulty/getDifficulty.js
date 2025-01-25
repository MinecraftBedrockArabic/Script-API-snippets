import { world, system } from "@minecraft/server";

/**
 * Determines the current game difficulty by attempting to spawn a cave spider
 * and checking its behavior.
 *
 * @returns {Promise<string>} A promise that resolves to a string indicating the difficulty level.
 * @throws {Error} If no players are found or cave spider spawning fails.
 */

async function getDifficulty() {
  return new Promise((resolve, reject) => {
    const player = world.getPlayers()[0];
    if (!player) return reject("No players found. The player is used to unsure the area is loaded.");
    const loc = player.location;
    const y = player.dimension.heightRange.min;

    let cave_spider;
    try {
      cave_spider = player.dimension.spawnEntity("minecraft:cave_spider", {x: loc.x, y: y, z: loc.z});
    } catch (error) {
      return resolve("peaceful");
    }
    cave_spider.setDynamicProperty("difficulty_observer", true);
    cave_spider.triggerEvent("minecraft:become_hostile");

    const id = world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {
      const { entity, eventId } = event;
      if (eventId === "minecraft:become_hostile" && entity.typeId === "minecraft:cave_spider" && entity.getDynamicProperty("difficulty_observer")) {
        const modifiers = event.getModifiers();
        for (const modifier of modifiers) {
          for (const group of modifier.addedComponentGroups) {
            if (group.includes("minecraft:spider_poison_")) {
              cleanup(entity, id);
              return resolve(group.split("_").pop());
            }
          }
        }
        cleanup(entity, id);
        return resolve("normal");
      } else {
        system.runTimeout(() => {
          try {
            cleanup(entity, id);
          } catch (error) {}
          return reject("Request timed out.");
        });
      }
    });
  });
}

function cleanup(entity, listenerId) {
  world.afterEvents.dataDrivenEntityTrigger.unsubscribe(listenerId);
  entity.remove();
}

export default getDifficulty;
