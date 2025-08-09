import { SPRITE_BASE64 } from "../config";
import { CanvasBuffer } from "./canvasBuffer";
import { PaletteApplier } from "./palletteApplier";
import { SpriteSheet } from "./spriteSheet";

export class SpriteBuilder {
  static async loadSpriteSheet(): Promise<SpriteSheet> {
    const img = new Image();
    img.src = SPRITE_BASE64;
    const spriteSheet = new SpriteSheet(img);

    return new Promise<SpriteSheet>((resolve) => {
      img.onload = async () => {
        resolve(spriteSheet);
      };
    });
  }

  static async createPlayer(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(27, 30);

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

    const sprite = await PaletteApplier.applyPalette(buffer.toImage(), palette);

    // Ensure the sprite is fully loaded so we get the correct dimensions
    await sprite.decode();

    return sprite;
  }

  static async createBasicEnemy(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(14, 14);

    buffer.drawSprite(sheet, 0, 0, 16, 0, 14, 14);

    const sprite = await PaletteApplier.applyPalette(buffer.toImage(), palette);

    // Ensure the sprite is fully loaded so we get the correct dimensions
    await sprite.decode();

    return sprite;
  }
}
