import { CanvasBuffer } from "./canvas-buffer";
import { SpriteSheet } from "./sprite-sheet";

export class SpriteBuilder {
  static createPlayer(sheet: SpriteSheet): HTMLImageElement {
    // Offscreen buffer 32x24 (like in original code)
    const buffer = new CanvasBuffer(32, 24);

    // Draw player body from sprite sheet
    buffer.drawSprite(sheet, 0, 8, 16, 32, 32, 16);

    // Draw player head from sprite sheet
    buffer.drawSprite(sheet, 9, 0, 0, 32, 16, 16);

    // Return as an image for reuse
    return buffer.toImage();
  }
}
