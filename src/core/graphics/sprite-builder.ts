import { CanvasBuffer } from "./canvas-buffer";
import { PaletteApplier } from "./paletter-applier";
import { SpriteSheet } from "./sprite-sheet";

export class SpriteBuilder {
  static async createPlayer(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    // Offscreen buffer (same size as your composite sprite)
    const buffer = new CanvasBuffer(32, 24);

    // Draw player body
    buffer.drawSprite(sheet, 0, 8, 16, 32, 32, 16);

    // Draw player head
    buffer.drawSprite(sheet, 9, 0, 0, 32, 16, 16);

    // Apply palette to the final composite image
    return await PaletteApplier.applyPalette(buffer.toImage(), palette);
  }

  // static createCustomSprite(
  //   sheet: SpriteSheet,
  //   parts: { index: number; x: number; y: number; w: number; h: number }[],
  //   palette: string[]
  // ): HTMLCanvasElement {
  //   // Find total width/height dynamically if needed
  //   const maxWidth = Math.max(...parts.map((p) => p.w));
  //   const totalHeight = parts.reduce((sum, p) => sum + p.h, 0);

  //   const buffer = new CanvasBuffer(maxWidth, totalHeight);

  //   for (const part of parts) {
  //     buffer.drawSprite(sheet, part.index, part.x, part.y, part.w, part.h);
  //   }

  //   return PaletteApplier.applyPalette(buffer.toImage(), palette);
  // }
}
