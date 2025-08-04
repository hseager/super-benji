import { drawEngine } from "./draw-engine";

export class LevelManager {
  private currentLevel: number = 1;
  private displayTimer = 0;

  /** Start a specific level (used on init or after nextLevel) */
  startLevel(level: number) {
    this.currentLevel = level;
    this.displayTimer = 2;
  }

  /** Advance to the next level */
  nextLevel() {
    this.startLevel(this.currentLevel + 1);
  }

  /** Call this every frame with delta in milliseconds */
  update(delta: number) {
    if (this.displayTimer > 0) {
      this.displayTimer -= delta;
      this.drawLevelText();
    }
  }

  /** Draw level text if timer is active */
  drawLevelText() {
    drawEngine.context.save();
    drawEngine.context.font = "24px monospace";
    drawEngine.context.fillStyle = "white";
    drawEngine.context.textAlign = "center";
    drawEngine.context.fillText(
      `LEVEL ${this.currentLevel}`,
      drawEngine.canvasWidth / 2,
      80
    );
    drawEngine.context.restore();
  }
}
