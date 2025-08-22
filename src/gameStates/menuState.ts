import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { gameState } from "./gameState";

class MenuState implements State {
  playerAvatar: HTMLImageElement | null;
  spinTime = 0;

  constructor() {
    this.playerAvatar = null;
  }

  private startGame() {
    gameStateMachine.setState(gameState);
  }

  async onEnter() {
    c2d.addEventListener("click", this.startGame);
  }

  onUpdate(delta: number) {
    drawEngine.drawTitle("Benji", 56, drawEngine.getCenterX() + 15, 180);
    drawEngine.drawText(
      "Super",
      36,
      drawEngine.getCenterX() - 55,
      135,
      "#fff",
      "center",
      "#ee2626",
      3,
      Math.PI / -20
    );

    const { context } = drawEngine;

    context.save();
    context.font = `900 15px "Tahoma"`;
    context.textAlign = "center";
    context.fillStyle = "#f01b1bce";
    context.fillText("JS13K 2025", 60, drawEngine.canvasHeight - 10);
    context.restore();

    drawEngine.drawText(
      "by hseager",
      18,
      drawEngine.canvasWidth - 70,
      drawEngine.canvasHeight - 11,
      "#f0f0f0c7"
    );
    drawEngine.drawMenuAction(
      "Start Game",
      delta,
      drawEngine.canvasHeight * 0.6
    );
  }

  onLeave() {
    c2d.removeEventListener("click", this.startGame);
  }
}

export const menuState = new MenuState();
