import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { gameState } from "./gameState";
import { screenTransitions } from "@/core/controllers/ScreenTransitionController";
import { BASE_TRANSITION_ANIMATION_TIME } from "@/core/config";

class MenuState implements State {
  playerAvatar: HTMLImageElement | null;
  spinTime = 0;

  constructor() {
    this.playerAvatar = null;
  }

  private startGame() {
    screenTransitions.start(1, 0, BASE_TRANSITION_ANIMATION_TIME, () => {
      gameStateMachine.setState(gameState);
    });
  }

  async onEnter() {
    c2d.addEventListener("click", this.startGame);
  }

  onUpdate(delta: number) {
    drawEngine.drawTitle("Benji", 28, drawEngine.getCenterX() + 15, 110);
    drawEngine.drawText(
      "Super",
      18,
      drawEngine.getCenterX() - 30,
      94,
      "#fff",
      "center",
      "#ee2626",
      3,
      Math.PI / -20
    );

    const { context } = drawEngine;

    context.save();
    context.font = `900 10px "Tahoma"`;
    context.textAlign = "center";
    context.fillStyle = "#f01b1bce";
    context.fillText("js13k 2025", 35, drawEngine.canvasHeight - 10);
    context.restore();

    drawEngine.drawText(
      "by hseager",
      9,
      drawEngine.canvasWidth - 35,
      drawEngine.canvasHeight - 11,
      "#f0f0f0c7"
    );
    drawEngine.drawMenuAction("Start Game", delta, 180);
  }

  onLeave() {
    c2d.removeEventListener("click", this.startGame);
  }
}

export const menuState = new MenuState();
