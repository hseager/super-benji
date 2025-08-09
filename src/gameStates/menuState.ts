import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { controls } from "@/core/controllers/ControlsController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { gameState } from "./gameState";

class MenuState implements State {
  private startGame() {
    gameStateMachine.setState(gameState);
  }

  onEnter() {
    c2d.addEventListener("click", this.startGame);
  }

  onUpdate() {
    const xCenter = drawEngine.context.canvas.width / 2;
    // drawEngine.drawText("js13k 2025", 16, xCenter, 60);

    drawEngine.drawTitle("X-Type", 24, xCenter, 60);
    drawEngine.drawText(
      "Super",
      10,
      xCenter - 40,
      44,
      "#fff",
      "center",
      "#ee2626",
      2,
      Math.PI / -20
    );
    drawEngine.drawText(
      "Start Game",
      16,
      xCenter,
      200,
      "#fff",
      "center",
      "#333",
      4
    );
    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm) {
      gameStateMachine.setState(gameState);
    }
  }

  onLeave() {
    c2d.removeEventListener("click", this.startGame);
  }
}

export const menuState = new MenuState();
