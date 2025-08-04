import { drawEngine } from "./draw-engine";

export class LevelManager {
  private currentLevel: number = 1;
  private levelTextTimer: number = 0;
  private levelTextDuration: number = 2000; // 2 seconds
  private fadeDuration: number = 500; // fade in/out duration (ms)

  constructor() {}

  startLevel() {
    this.levelTextTimer = this.levelTextDuration; // reset timer when level starts
  }

  nextLevel() {
    this.currentLevel++;
    this.startLevel();
    // additional logic for spawning enemies, etc
  }

  update(delta: number) {
    if (this.levelTextTimer > 0) {
      this.levelTextTimer -= delta;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.levelTextTimer <= 0) return;

    // Calculate fade in/out alpha
    const timeElapsed = this.levelTextDuration - this.levelTextTimer;
    let alpha = 1;
    if (timeElapsed < this.fadeDuration) {
      // Fade in
      alpha = timeElapsed / this.fadeDuration;
    } else if (this.levelTextTimer < this.fadeDuration) {
      // Fade out
      alpha = this.levelTextTimer / this.fadeDuration;
    }

    ctx.save();
    ctx.globalAlpha = alpha;

    // Text style
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      `Level ${this.currentLevel}`,
      drawEngine.canvasWidth / 2,
      drawEngine.canvasHeight / 2
    );
    ctx.restore();
  }
}
