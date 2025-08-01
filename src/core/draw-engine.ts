export const logicalWidth = 144; // base logical resolution
export const logicalHeight = 256; // base logical resolution

class DrawEngine {
  context: CanvasRenderingContext2D;
  mousePosition: DOMPoint;
  isPointerDown: boolean = false;

  constructor() {
    this.context = c2d.getContext("2d");
    this.mousePosition = new DOMPoint(0, 0);

    c2d.addEventListener("mousemove", (event: MouseEvent) => {
      this.mousePosition = this.screenToLogical(event.clientX, event.clientY);
    });

    c2d.addEventListener("touchmove", (event: TouchEvent) => {
      const touch = event.touches[0];
      this.mousePosition = this.screenToLogical(touch.clientX, touch.clientY);
    });

    c2d.addEventListener("mousedown", () => (this.isPointerDown = true));
    c2d.addEventListener("mouseup", () => (this.isPointerDown = false));

    c2d.addEventListener("touchstart", () => {
      this.isPointerDown = true;
    });
    c2d.addEventListener("touchend", () => (this.isPointerDown = false));

    window.addEventListener("resize", () => this.resizeCanvas());
    window.addEventListener("orientationchange", () => this.resizeCanvas());
    this.resizeCanvas();
  }

  private screenToLogical(x: number, y: number): DOMPoint {
    const rect = c2d.getBoundingClientRect();
    const scaleX = logicalWidth / rect.width;
    const scaleY = logicalHeight / rect.height;

    return new DOMPoint((x - rect.left) * scaleX, (y - rect.top) * scaleY);
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  drawText(
    text: string,
    fontSize: number,
    x: number,
    y: number,
    color = "white",
    textAlign: "center" | "left" | "right" = "center"
  ) {
    const context = this.context;

    context.font = `${fontSize}px "Courier New", Roboto, Helvetica, Arial, sans-serif-black`;
    context.textAlign = textAlign;
    context.strokeStyle = "black";
    context.lineWidth = 4;
    context.strokeText(text, x, y);
    context.fillStyle = color;
    context.fillText(text, x, y);
  }

  resizeCanvas() {
    const targetRatio = logicalWidth / logicalHeight;
    const screenRatio = window.innerWidth / window.innerHeight;

    let displayWidth: number;
    let displayHeight: number;

    if (screenRatio > targetRatio) {
      // Screen is wider than target, fit height
      displayHeight = window.innerHeight;
      displayWidth = displayHeight * targetRatio;
    } else {
      // Screen is taller/narrower, fit width
      displayWidth = window.innerWidth;
      displayHeight = displayWidth / targetRatio;
    }

    this.context.canvas.style.width = `${displayWidth}px`;
    this.context.canvas.style.height = `${displayHeight}px`;
    this.context.imageSmoothingEnabled = false;
  }
}

export const drawEngine = new DrawEngine();
