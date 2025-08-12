import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";

export class LoseState implements State {
  level: number = 1;

  constructor(level: number) {
    this.level = level;
  }

  onEnter() {
    c2d.addEventListener("click", () => {
      window.location.reload();
    });
  }

  onUpdate(delta: number) {
    drawEngine.drawTitle("Game Over", 24, drawEngine.getCenterX(), 50);
    drawEngine.drawTitle("You made it", 18, drawEngine.getCenterX(), 100);
    drawEngine.drawTitle("to level", 18, drawEngine.getCenterX(), 115);
    drawEngine.drawTitle(
      this.level.toString(),
      24,
      drawEngine.getCenterX(),
      150
    );
    drawEngine.drawMenuAction("Back to Menu", delta);
  }
}
