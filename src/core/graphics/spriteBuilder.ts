import {
  BENJI_AVATAR_HEIGHT,
  BENJI_AVATAR_WIDTH,
  SPRITE_BASE64,
  TORX_AVATAR_HEIGHT,
  TORX_AVATAR_WIDTH,
} from "../config";
import { CanvasBuffer } from "./canvasBuffer";
import { PaletteApplier } from "./palletteApplier";
import { Flip, SpriteSheet } from "./spriteSheet";

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

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  static async createBasicEnemy(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(14, 14);

    buffer.drawSprite(sheet, 0, 0, 16, 0, 14, 14);

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  static async createModerateEnemy(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(16, 16);

    buffer.drawSprite(sheet, 0, 0, 16, 15, 16, 16);

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  static async createAdvancedEnemy(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(16, 16);

    buffer.drawSprite(sheet, 0, 0, 16, 32, 16, 16);

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  static async createBullet(
    sheet: SpriteSheet,
    palette: string[],
    flip: number = Flip.None
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(3, 3);

    buffer.drawSprite(sheet, 0, 0, 0, 0, 3, 3, flip);

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  static async createPlayerAvatar(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(BENJI_AVATAR_WIDTH, BENJI_AVATAR_HEIGHT);

    buffer.drawSprite(
      sheet,
      0,
      0,
      29,
      52,
      BENJI_AVATAR_WIDTH,
      BENJI_AVATAR_HEIGHT
    );

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  static async createTorxAvatar(
    sheet: SpriteSheet,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const buffer = new CanvasBuffer(TORX_AVATAR_WIDTH, TORX_AVATAR_HEIGHT);

    buffer.drawSprite(
      sheet,
      0,
      0,
      47,
      68,
      TORX_AVATAR_WIDTH,
      TORX_AVATAR_HEIGHT
    );

    return SpriteBuilder.applyPalette(buffer, palette);
  }

  private static async applyPalette(
    buffer: CanvasBuffer,
    palette: string[]
  ): Promise<HTMLImageElement> {
    const sprite = await PaletteApplier.applyPalette(buffer.toImage(), palette);

    // Ensure the sprite is fully loaded so we get the correct dimensions
    await sprite.decode();

    return sprite;
  }
}
