import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { gameState } from "./gameState";
import { DEFAULT_FONT } from "@/core/config";

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
    const { context } = drawEngine;

    // Main Text
    const text = "BENJI";
    const y = 180;
    const fontSize = 56;

    context.save();
    context.textAlign = "center";
    context.font = `900 ${fontSize}px ${DEFAULT_FONT}`;

    context.lineJoin = "round"; // or "bevel"
    context.lineCap = "round";

    context.lineWidth = 10;
    context.strokeStyle = "#322d5a";
    context.strokeText(text, drawEngine.getCenterX(), y);

    // --- Thin inner stroke ---
    context.lineWidth = 2;
    context.strokeStyle = "#fe4d2c";
    context.strokeText(text, drawEngine.getCenterX(), y);

    const gradient = context.createLinearGradient(0, 0, 200, 0);
    gradient.addColorStop(0, "#c95f33");
    gradient.addColorStop(1, "#fed266");
    context.fillStyle = gradient;

    context.fillText(text, drawEngine.getCenterX(), y);
    drawEngine.drawText(
      "SUPER",
      24,
      drawEngine.getCenterX() - 65,
      138,
      "#8e5439",
      "center",
      "#aa221b",
      2,
      Math.PI / -20,
      "Arial"
    );

    context.font = `900 14px "Tahoma"`;
    context.fillStyle = "#f01b1b";
    context.fillText("JS13K 2025", 55, drawEngine.canvasHeight - 10);

    drawEngine.drawText(
      "by hseager",
      14,
      drawEngine.canvasWidth - 60,
      drawEngine.canvasHeight - 11,
      "#f0f0f0c7"
    );
    drawEngine.drawMenuAction(
      "Start Game",
      delta,
      drawEngine.canvasHeight * 0.6
    );

    context.restore();
  }

  onLeave() {
    c2d.removeEventListener("click", this.startGame);
  }
}

export const menuState = new MenuState();
