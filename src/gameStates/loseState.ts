import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";

export class LoseState implements State {
  constructor() {}

  onEnter() {
    c2d.addEventListener("click", () => {
      window.location.reload();
    });
  }

  onUpdate(delta: number) {
    drawEngine.drawTitle("You were", 18, drawEngine.getCenterX(), 50);
    drawEngine.drawTitle("destroyed!", 18, drawEngine.getCenterX(), 70);
    drawEngine.drawMenuAction("Back to Menu", delta);
  }
}
