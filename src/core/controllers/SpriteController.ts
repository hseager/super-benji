import { SpriteBuilder } from "../graphics/spriteBuilder";
import {
  ADVANCED_ENEMY_PALETTE,
  BASIC_ENEMY_PALETTE,
  ENEMY_BULLET_PALETTE,
  MODERATE_ENEMY_PALETTE,
  PLAYER_BULLET_PALETTES,
  PLAYER_PALETTE,
} from "../config";
import { SpriteSheet } from "../graphics/spriteSheet";

export class SpriteController {
  playerSprite!: HTMLImageElement;
  basicEnemySprite!: HTMLImageElement;
  moderateEnemySprite!: HTMLImageElement;
  advancedEnemySprite!: HTMLImageElement;
  playerBulletSprite!: HTMLImageElement;
  enemyBulletSprite!: HTMLImageElement;

  private spriteSheet!: SpriteSheet;

  playerBulletSprites: Record<string, HTMLImageElement> = {};

  async init() {
    this.spriteSheet = await SpriteBuilder.loadSpriteSheet();

    await this.preloadBulletPalettes();

    this.playerSprite = await SpriteBuilder.createPlayer(
      this.spriteSheet,
      PLAYER_PALETTE
    );

    this.basicEnemySprite = await SpriteBuilder.createBasicEnemy(
      this.spriteSheet,
      BASIC_ENEMY_PALETTE
    );
    this.moderateEnemySprite = await SpriteBuilder.createModerateEnemy(
      this.spriteSheet,
      MODERATE_ENEMY_PALETTE
    );
    this.advancedEnemySprite = await SpriteBuilder.createAdvancedEnemy(
      this.spriteSheet,
      ADVANCED_ENEMY_PALETTE
    );

    this.enemyBulletSprite = await SpriteBuilder.createBullet(
      this.spriteSheet,
      ENEMY_BULLET_PALETTE
    );

    return this;
  }

  private async preloadBulletPalettes() {
    const palettes = Object.keys(PLAYER_BULLET_PALETTES);
    for (const color of palettes) {
      const palette =
        PLAYER_BULLET_PALETTES[color as keyof typeof PLAYER_BULLET_PALETTES];
      this.playerBulletSprites[color] = await SpriteBuilder.createBullet(
        this.spriteSheet,
        palette
      );
    }
  }

  getBulletSprite(color: string = "blue") {
    return this.playerBulletSprites[color] ?? this.playerBulletSprites["blue"];
  }
}
