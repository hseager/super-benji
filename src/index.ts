import { drawEngine } from "./core/draw-engine";
import { createGameStateMachine, gameStateMachine } from "./game-state-machine";
import { controls } from "@/core/controls";
import { menuState } from "./game-states/menu.state";

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
