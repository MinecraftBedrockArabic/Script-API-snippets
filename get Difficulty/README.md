## Overview
![Deprecated](https://img.shields.io/badge/status-deprecated-red)
![Deprecated](https://img.shields.io/badge/The%20game%20now%20have%20a%20native%20Script%20Api%20Difficulty%20functions.-yellow)

[Read more.](https://feedback.minecraft.net/hc/en-us/articles/34063162910093-Minecraft-Beta-Preview-1-21-70-22)

`getDifficulty` is an asynchronous function to determines the current game difficulty by attempting to spawn a cave spider and checking its behavior.


## Requirements
- `@minecraft/server` module.

## Installation
1. Clone or download the function file.
2. Ensure you have the `@minecraft/server` module in your manifest.
3. Import the `getDifficulty` function into your script.

### Example
```javascript
import { world } from "@minecraft/server";
import getDifficulty  from "./getDifficulty";

world.afterEvents.itemUse.subscribe(async (event) => {
    const difficulty = await getDifficulty();
    if(!difficulty){
        event.source.sendMessage('Unable to determine difficulty.');
        return;
    }
    event.source.sendMessage('The current difficulty is §a' + difficulty);
});
```

[![Watch the video](https://img.youtube.com/vi/PPsobbFxi1Q/0.jpg)](https://youtu.be/PPsobbFxi1Q)
