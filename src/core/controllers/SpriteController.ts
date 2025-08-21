import { SpriteBuilder } from "../graphics/spriteBuilder";
import {
  ADVANCED_ENEMY_PALETTE,
  BASIC_ENEMY_PALETTE,
  JACKAL_AVATAR_PALETTE,
  MAGGIE_AVATAR_PALETTE,
  MODERATE_ENEMY_PALETTE,
  BENJI_AVATAR_PALETTE,
  BULLET_PALETTES,
  PLAYER_PALETTE,
  TORX_AVATAR_PALETTE,
} from "../config";
import { SpriteSheet } from "../graphics/spriteSheet";

export class SpriteController {
  playerSprite!: HTMLImageElement;
  playerAvatar!: HTMLImageElement;
  basicEnemySprite!: HTMLImageElement;
  moderateEnemySprite!: HTMLImageElement;
  advancedEnemySprite!: HTMLImageElement;
  playerBulletSprite!: HTMLImageElement;
  torxAvatar!: HTMLImageElement;
  maggieAvatar!: HTMLImageElement;
  jackalAvatar!: HTMLImageElement;

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

    this.playerAvatar = await SpriteBuilder.createPlayerAvatar(
      this.spriteSheet,
      BENJI_AVATAR_PALETTE
    );

    this.torxAvatar = await SpriteBuilder.createTorxAvatar(
      this.spriteSheet,
      TORX_AVATAR_PALETTE
    );

    this.maggieAvatar = await SpriteBuilder.createMaggieAvatar(
      this.spriteSheet,
      MAGGIE_AVATAR_PALETTE
    );

    this.jackalAvatar = await SpriteBuilder.createJackalAvatar(
      this.spriteSheet,
      JACKAL_AVATAR_PALETTE
    );

    return this;
  }

  private async preloadBulletPalettes() {
    const palettes = Object.keys(BULLET_PALETTES);
    for (const color of palettes) {
      const palette = BULLET_PALETTES[color as keyof typeof BULLET_PALETTES];
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
