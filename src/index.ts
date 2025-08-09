import { drawEngine } from "./core/controllers/DrawController";
import {
  createGameStateMachine,
  gameStateMachine,
} from "./gameStates/gameStateMachine";
import { controls } from "@/core/controllers/ControlsController";
import { menuState } from "./gameStates/menuState";

createGameStateMachine(menuState);

let previousTime = performance.now();

(() => {
  function gameLoop(currentTime: number) {
    const delta = (currentTime - previousTime) / 1000; // in seconds
    previousTime = currentTime;

    drawEngine.context.clearRect(
      0,
      0,
      drawEngine.canvasWidth,
      drawEngine.canvasHeight
    );

    gameStateMachine.getState().onUpdate(delta);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();
