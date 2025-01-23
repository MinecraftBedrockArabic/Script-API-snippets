function getEntityHitLocation(args) {
  const {player,dimension,location = {},direction = {},options = {},} = args;
  let loc, dir, rayHit;
  if (player) {
    loc = player.getHeadLocation();
    dir = player.getViewDirection();
    rayHit = player.getEntitiesFromViewDirection(options)[0];
  } else if (!location || !direction || !dimension) {
    throw new Error("Either [<player>] or [<dimension> and <location> and <direction>] must be provided.");
  } else if (dimension) {
    loc = options.location;
    dir = options.direction;
    rayHit = dimension.getEntitiesFromRay(location, direction, options)[0];
  }

  if (!rayHit) return;
  const dis = rayHit.distance;

  return {
    entity: rayHit.entity,
    distance: dis,
    hitLocation: {
      x: loc.x + dir.x * dis,
      y: loc.y + dir.y * dis,
      z: loc.z + dir.z * dis,
    },
  };
}

export { getEntityHitLocation };
