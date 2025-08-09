import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";

export class LoseState implements State {
  constructor() {}

  onEnter() {
    c2d.addEventListener("click", () => {
      window.location.reload();
    });
  }

  onUpdate() {
    drawEngine.drawTitle("You were", 18, drawEngine.getCenterX(), 50);
    drawEngine.drawTitle("destroyed!", 18, drawEngine.getCenterX(), 70);
    drawEngine.drawText("Back to Menu", 16, drawEngine.getCenterX(), 200);
  }
}
