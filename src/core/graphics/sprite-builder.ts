import { CanvasBuffer } from "./canvas-buffer";
import { PaletteApplier } from "./paletter-applier";
import { SpriteSheet } from "./sprite-sheet";

export class SpriteBuilder {
  static async createPlayer(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(32, 24);

    // Draw player
    buffer.drawSprite(sheet, 0, 8, 0, 0, 16, 16);

    // Apply palette to the final composite image
    return await PaletteApplier.applyPalette(buffer.toImage(), palette);
  }
}
