import { drawEngine } from "./DrawController";

class ScreenTransitionController {
  fadeAlpha = 0;
  isFading = false;
  fadeType: "fade-in" | "fade-out" | null = null;
  fadeDuration = 1;
  fadeElapsed = 0;
  onFadeComplete?: () => void;

  startFade(
    type: "fade-in" | "fade-out",
    duration: number = 0.5,
    onComplete?: () => void
  ) {
    this.fadeType = type;
    this.fadeDuration = duration;
    this.fadeElapsed = 0;
    this.isFading = true;
    this.onFadeComplete = onComplete;

    this.fadeAlpha = type === "fade-in" ? 1 : 0;
  }

  update(delta: number) {
    if (!this.isFading) return;

    this.fadeElapsed += delta;
    let t = Math.min(this.fadeElapsed / this.fadeDuration, 1);

    if (this.fadeType === "fade-in") {
      this.fadeAlpha = 1 - t; // 1 → 0
    } else if (this.fadeType === "fade-out") {
      this.fadeAlpha = t; // 0 → 1
    }

    if (t >= 1) {
      this.isFading = false;
      this.onFadeComplete?.();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isFading && this.fadeAlpha === 0) return;

    ctx.save();
    ctx.fillStyle = `rgba(0, 0, 0, ${this.fadeAlpha * 0.8})`;
    ctx.fillRect(0, 0, drawEngine.canvasWidth, drawEngine.canvasHeight);
    ctx.restore();
  }
}

export const screenTransitions = new ScreenTransitionController();
