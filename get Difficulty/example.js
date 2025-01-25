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