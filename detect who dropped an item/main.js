import { world } from "@minecraft/server"

world.afterEvents.entitySpawn.subscribe((event) => {
  const {entity} = event
  if(entity.typeId !== "minecraft:item") return;
  const closestPlayers = entity.dimension.getEntities({
      type: "minecraft:player",
      location: entity.location,
      maxDistance: 2,
  });

  if (closestPlayers.length == 0) return;
  const player = closestPlayers.find(p=> 
      p.getRotation().x === entity.getRotation().x &&
      p.getRotation().y === entity.getRotation().y
  );
  if (!player) return;
  const item = entity.getComponent("item").itemStack
  world.sendMessage(`§a${item.typeId}§r was dropped by §2${player.nameTag}§r!`)
})