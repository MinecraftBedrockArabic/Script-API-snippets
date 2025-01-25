
# getEntityHitLocation

A function that returns detailed information about a ray cast hit, including the entity, distance, and precise hit location.

## Requirements
- `@minecraft/server` module.

## Installation
1. Clone or download the function file.
2. Ensure you have the `@minecraft/server` module in your manifest.
3. Import the `getEntityHitLocation` function into your script.

```javascript
import { getEntityHitLocation } from "./getEntityHitLocation.js";
```

## Usage

### Example 1: Using a player's view direction

The following example demonstrates detecting an entity hit by a player’s view direction and spawning a particle at the hit location:

```javascript
import { system, world } from "@minecraft/server";
import { getEntityHitLocation } from "./getEntityHitLocation.js";

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const entityHitLocation = getEntityHitLocation({ player: player });
    if (!entityHitLocation) {
      world.sendMessage(`No entity was hit.`);
      continue;
    }
    player.dimension.spawnParticle("minecraft:basic_flame_particle", entityHitLocation.hitLocation);
  }
});
```
[![Watch the video](https://img.youtube.com/vi/76Nxs4uX3jo/0.jpg)](https://youtu.be/76Nxs4uX3jo)

### Example 2: Using a custom ray with location and direction

The following example demonstrates detecting an entity using a custom ray and spawning a particle at the hit location:

```javascript
import { system, world } from "@minecraft/server";
import { getEntityHitLocation } from "./getEntityHitLocation.js";

system.runInterval(() => {
  const location = { x: 0, y: 0, z: 0 };
  const direction = { x: 1, y: 0, z: 0 };
  const dimension = world.getDimension("overworld");

  const entityHitLocation = getEntityHitLocation({
    dimension: dimension,
    location: location,
    direction: direction
  });

  if (!entityHitLocation) {
    world.sendMessage(`No entity was hit.`);
    return;
  }

  dimension.spawnParticle("minecraft:basic_flame_particle", entityHitLocation.hitLocation);
});
```
