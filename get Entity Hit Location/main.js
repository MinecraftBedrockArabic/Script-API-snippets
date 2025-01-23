import { system, world} from "@minecraft/server";
import { getEntityHitLocation } from "./getEntityHitLocation.js";

//Example Usage:

//  - Using player view direction.

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const entityHitLocation = getEntityHitLocation({player:player})
    if (!entityHitLocation){
      world.sendMessage(`No entity was hit.`);
      continue;
    };
    player.dimension.spawnParticle("minecraft:basic_flame_particle", entityHitLocation.hitLocation);
  }
});

//  - Using a ray with custom location and direction.

system.runInterval(() => {
  const location = {x: 0, y: 0, z: 0};
  const direction = {x: 1, y: 0, z: 0};
  const dimension = world.getDimension("overworld");
  const entityHitLocation = getEntityHitLocation({dimension:dimension, location:location, direction:direction});
  if (!entityHitLocation){
    world.sendMessage(`No entity was hit.`);
    return;
  };
  dimension.spawnParticle("minecraft:basic_flame_particle", entityHitLocation.hitLocation);
});
