import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { gameStateMachine } from "@/gameStates/gameStateMachine";
import { gameState } from "./gameState";
import { screenTransitions } from "@/core/controllers/ScreenTransitionController";
import {
  BASE_TRANSITION_ANIMATION_TIME,
  BENJI_AVATAR_HEIGHT,
  BENJI_AVATAR_WIDTH,
  PLAYER_AVATAR_PALETTE,
} from "@/core/config";
import { SpriteBuilder } from "@/core/graphics/spriteBuilder";

class MenuState implements State {
  playerAvatar: HTMLImageElement | null;
  spinTime = 0;

  constructor() {
    this.playerAvatar = null;
  }

  private startGame() {
    screenTransitions.startFade(
      "fade-out",
      BASE_TRANSITION_ANIMATION_TIME,
      () => {
        gameStateMachine.setState(gameState);
      }
    );
  }

  async onEnter() {
    c2d.addEventListener("click", this.startGame);
    const spriteSheet = await SpriteBuilder.loadSpriteSheet();

    this.playerAvatar = await SpriteBuilder.createPlayerAvatar(
      spriteSheet,
      PLAYER_AVATAR_PALETTE
    );
  }

  onUpdate(delta: number) {
    drawEngine.drawTitle("Benji", 28, drawEngine.getCenterX() + 15, 60);
    drawEngine.drawText(
      "Super",
      18,
      drawEngine.getCenterX() - 30,
      44,
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
    drawEngine.drawMenuAction("Start Game", delta, 195);

    this.spinTime += delta * 0.6;

    if (this.playerAvatar) {
      const { context } = drawEngine;

      const x = drawEngine.getCenterX();
      const y = 127; // vertical center of avatar
      const xSize = BENJI_AVATAR_WIDTH * 2;
      const ySize = BENJI_AVATAR_HEIGHT * 2;

      // // Scale horizontally using cosine for smooth flip
      // const scaleX = Math.cos(this.spinTime);

      // context.save();
      context.translate(x, y); // move to avatar center
      // context.scale(scaleX, 1); // squash horizontally

      // // Clip to a circle so edges are round
      // context.beginPath();
      // context.arc(0, 0, size / 2, 0, Math.PI * 2);
      // context.clip();

      // Draw the avatar centered
      context.drawImage(
        this.playerAvatar,
        -xSize / 2,
        -xSize / 2,
        xSize,
        ySize
      );

      context.restore();
    }
  }

  onLeave() {
    c2d.removeEventListener("click", this.startGame);
  }
}

export const menuState = new MenuState();
