import { State } from "@/core/types";
import { drawEngine } from "@/core/controllers/DrawController";
import { controls } from "@/core/controllers/ControlsController";

class WinState implements State {
  onEnter() {
    c2d.addEventListener("click", () => {
      window.location.reload();
    });
  }

  onUpdate() {
    drawEngine.drawText("You Win!", 60, drawEngine.getCenterX(), 60);
    drawEngine.drawText("Back to Menu", 60, drawEngine.getCenterX(), 400);
    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm) {
      window.location.reload();
    }
  }
}

export const winState = new WinState();
