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
    drawEngine.drawText("You were", 14, xCenter, 50);
    drawEngine.drawText("destroyed!", 14, xCenter, 65);
    drawEngine.drawText("Back to Menu", 16, xCenter, 200);
  }
}
