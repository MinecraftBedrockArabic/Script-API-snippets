# Player Crawling Detection

This script extends the `Player` prototype to include a method for detecting whether a player is in a crawling state. The detection is based on the distance between the player's head location and feet location, along with checks to ensure the player is not swimming, gliding, or sleeping.

## Code

```javascript
import { Player } from "@minecraft/server";

/**
 * Checks if the player is in a crawling state based on the distance between their head location and feet location.
 * @return {boolean} true if the player is crawling, false otherwise
 */
Player.prototype.isCrawling = function () {
    const distance = this.getHeadLocation().y - this.location.y;
    return distance < 0.31 && !this.isSwimming && !this.isGliding && !this.isSleeping;
};
```

## How to Use
1. Copy the code above and add it to your script.
2. Use the `isCrawling` method to check if a player is crawling.

### Example Usage

```javascript
// Check if the player is crawling
if (player.isCrawling()) {
    player.sendMessage("Stop crawling like a baby :p");
}
```

## Requirements
- `@minecraft/server` module.