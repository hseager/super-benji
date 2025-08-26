import { SpriteBuilder } from "../graphics/spriteBuilder";
import {
  ADVANCED_ENEMY_PALETTE,
  BASIC_ENEMY_PALETTE,
  JACKAL_AVATAR_PALETTE,
  MAGGIE_AVATAR_PALETTE,
  MODERATE_ENEMY_PALETTE,
  BENJI_AVATAR_PALETTE,
  BULLET_PALETTES,
  PLAYER_PALETTES,
  TORX_AVATAR_PALETTE,
} from "../config";
import { PaletteApplier } from "../graphics/palletteApplier";

export class SpriteController {
  spriteBuilder!: SpriteBuilder;

  playerSprites: Record<string, HTMLImageElement> = {};
  bulletSprites: Record<string, HTMLImageElement> = {};
  playerAvatar!: HTMLImageElement;
  basicEnemySprite!: HTMLImageElement;
  moderateEnemySprite!: HTMLImageElement;
  advancedEnemySprite!: HTMLImageElement;
  torxAvatar!: HTMLImageElement;
  maggieAvatar!: HTMLImageElement;
  jackalAvatar!: HTMLImageElement;
  jackalSprite!: HTMLImageElement;
  benjiCoin!: HTMLImageElement;

  async init() {
    const spriteBuilder = new SpriteBuilder();
    this.spriteBuilder = await spriteBuilder.init();

    // preload sprites in parallel
    await Promise.all([
      this.preloadPlayerSprites(),
      this.preloadBulletPalettes(),
      (async () =>
        (this.basicEnemySprite = await spriteBuilder.createSprite(
          BASIC_ENEMY_PALETTE,
          14,
          14,
          0,
          1
        )))(),
      (async () =>
        (this.moderateEnemySprite = await spriteBuilder.createSprite(
          MODERATE_ENEMY_PALETTE,
          16,
          16,
          0,
          15
        )))(),
      (async () =>
        (this.advancedEnemySprite = await spriteBuilder.createSprite(
          ADVANCED_ENEMY_PALETTE,
          16,
          16,
          2,
          16
        )))(),
      (async () =>
        (this.playerAvatar = await spriteBuilder.createAvatar(
          BENJI_AVATAR_PALETTE,
          18,
          16,
          29,
          32
        )))(),
      (async () =>
        (this.torxAvatar = await spriteBuilder.createAvatar(
          TORX_AVATAR_PALETTE,
          17,
          16,
          47,
          49
        )))(),
      (async () =>
        (this.maggieAvatar = await spriteBuilder.createAvatar(
          MAGGIE_AVATAR_PALETTE,
          17,
          16,
          47,
          32
        )))(),
      (async () =>
        (this.jackalAvatar = await spriteBuilder.createSprite(
          JACKAL_AVATAR_PALETTE,
          16,
          20,
          31,
          48
        )))(),
      (async () =>
        (this.jackalSprite = await spriteBuilder.createSprite(
          JACKAL_AVATAR_PALETTE,
          32,
          31,
          32,
          0
        )))(),
    ]);

    // coin depends on playerAvatar, so wait separately
    const goldWithoutFirst = PLAYER_PALETTES.gold.slice(1);
    this.benjiCoin = await PaletteApplier.applyPalette(
      this.playerAvatar,
      goldWithoutFirst
    );

    return this;
  }

  getPlayerSprite(color: string = "grey") {
    return this.playerSprites[color] ?? this.playerSprites["grey"];
  }

  private async preloadPlayerSprites() {
    const palettes = Object.keys(PLAYER_PALETTES);
    for (const color of palettes) {
      const palette = PLAYER_PALETTES[color as keyof typeof PLAYER_PALETTES];
      this.playerSprites[color] = await this.spriteBuilder.createSprite(
        palette,
        25,
        30,
        4,
        38
      );
    }
  }

  //   const buffer = new CanvasBuffer(54, 60);

  // const maxWingSize = 14;
  // const bodySize = 30;

  // // Draw body
  // buffer.drawSprite(this.sheet, maxWingSize, 0, 0, 15, 13, 30);

  private async preloadBulletPalettes() {
    const palettes = Object.keys(BULLET_PALETTES);
    for (const color of palettes) {
      const palette = BULLET_PALETTES[color as keyof typeof BULLET_PALETTES];
      this.bulletSprites[color] = await this.spriteBuilder.createSprite(
        palette,
        3,
        3,
        0,
        65
      );
    }
  }

  getBulletSprite(color: string = "blue") {
    return this.bulletSprites[color] ?? this.bulletSprites["blue"];
  }
}
