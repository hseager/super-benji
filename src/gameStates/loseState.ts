import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { controls } from "@/core/controllers/ControlsController";

export class LoseState implements State {
  constructor() {}

  onEnter() {
    c2d.addEventListener("click", () => {
      window.location.reload();
    });
  }

  onUpdate() {
    const xCenter = drawEngine.context.canvas.width / 2;
    drawEngine.drawText("You Lose!", 80, xCenter, 90);
    drawEngine.drawText("Back to Menu", 60, xCenter, 400);

    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm) {
      window.location.reload();
    }
  }
}
