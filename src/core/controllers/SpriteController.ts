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
import { SpriteSheet } from "../graphics/spriteSheet";

export class SpriteController {
  private spriteSheet!: SpriteSheet;

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

  async init() {
    this.spriteSheet = await SpriteBuilder.loadSpriteSheet();

    await this.preloadPlayerSprites();
    await this.preloadBulletPalettes();

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

    this.jackalSprite = await SpriteBuilder.createJackalSprite(
      this.spriteSheet,
      JACKAL_AVATAR_PALETTE
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
      this.playerSprites[color] = await SpriteBuilder.createPlayer(
        this.spriteSheet,
        palette
      );
    }
  }

  private async preloadBulletPalettes() {
    const palettes = Object.keys(BULLET_PALETTES);
    for (const color of palettes) {
      const palette = BULLET_PALETTES[color as keyof typeof BULLET_PALETTES];
      this.bulletSprites[color] = await SpriteBuilder.createBullet(
        this.spriteSheet,
        palette
      );
    }
  }

  getBulletSprite(color: string = "blue") {
    return this.bulletSprites[color] ?? this.bulletSprites["blue"];
  }
}
