import { CanvasBuffer } from "./canvas-buffer";
import { PaletteApplier } from "./paletter-applier";
import { SpriteSheet } from "./sprite-sheet";

export class SpriteBuilder {
  static async createPlayer(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(27, 32);

    // const wingSize = 6;
    const maxWingSize = 7;
    const bodySize = 13;

    // Draw body
    buffer.drawSprite(sheet, maxWingSize, 0, 0, 15, 13, 30);

    // Draw Basic Wings
    // Left Wing
    buffer.drawSprite(sheet, 1, 18, 0, 45, 6, 9);
    // Right Wing
    buffer.drawSprite(sheet, bodySize + maxWingSize - 1, 18, 0, 45, 6, 9, 1);
    //
    // Advanced Wings
    // Left Wing
    // buffer.drawSprite(sheet, 0, 15, 0, 54, 8, 13);
    // // Right Wing
    // buffer.drawSprite(sheet, bodySize + maxWingSize, 15, 0, 54, 8, 13, 1);

    // Apply palette to the final composite image
    return await PaletteApplier.applyPalette(buffer.toImage(), palette);
  }
}
