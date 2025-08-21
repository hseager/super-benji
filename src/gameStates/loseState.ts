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
    drawEngine.drawTitle("Game Over", 48, drawEngine.getCenterX(), 100);
    drawEngine.drawTitle("You made it", 32, drawEngine.getCenterX(), 200);
    drawEngine.drawTitle("to level", 32, drawEngine.getCenterX(), 230);
    drawEngine.drawTitle(
      this.level.toString(),
      48,
      drawEngine.getCenterX(),
      300
    );
    drawEngine.drawMenuAction("Back to Menu", delta);
  }
}
