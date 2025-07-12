import { State } from "@/core/types";
import { drawEngine } from "@/core/draw-engine";
import { controls } from "@/core/controls";

class WinState implements State {
  onEnter() {
    c2d.addEventListener("click", () => {
      window.location.reload();
    });
  }

  onUpdate() {
    const xCenter = drawEngine.context.canvas.width / 2;
    drawEngine.drawText("You Win!", 60, xCenter, 60);
    drawEngine.drawText("Back to Menu", 60, xCenter, 400);
    this.updateControls();
  }

  updateControls() {
    if (controls.isConfirm) {
      window.location.reload();
    }
  }
}

export const winState = new WinState();
