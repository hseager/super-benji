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
    const xCenter = drawEngine.context.canvas.width / 2;
    drawEngine.drawTitle("You were", 18, xCenter, 50);
    drawEngine.drawTitle("destroyed!", 18, xCenter, 70);
    drawEngine.drawText("Back to Menu", 16, xCenter, 200);
  }
}
