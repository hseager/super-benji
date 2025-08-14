import { SpriteBuilder } from "../graphics/spriteBuilder";
import {
  ADVANCED_ENEMY_PALETTE,
  BASIC_ENEMY_PALETTE,
  ENEMY_BULLET_PALETTE,
  MODERATE_ENEMY_PALETTE,
  PLAYER_BULLET_PALETTE,
  PLAYER_PALETTE,
} from "../config";
import { Flip } from "../graphics/spriteSheet";

export class SpriteController {
  playerSprite!: HTMLImageElement;
  basicEnemySprite!: HTMLImageElement;
  moderateEnemySprite!: HTMLImageElement;
  advancedEnemySprite!: HTMLImageElement;
  playerBulletSprite!: HTMLImageElement;
  enemyBulletSprite!: HTMLImageElement;

  async init() {
    const spriteSheet = await SpriteBuilder.loadSpriteSheet();

    this.playerSprite = await SpriteBuilder.createPlayer(
      spriteSheet,
      PLAYER_PALETTE
    );

    this.basicEnemySprite = await SpriteBuilder.createBasicEnemy(
      spriteSheet,
      BASIC_ENEMY_PALETTE
    );
    this.moderateEnemySprite = await SpriteBuilder.createModerateEnemy(
      spriteSheet,
      MODERATE_ENEMY_PALETTE
    );
    this.advancedEnemySprite = await SpriteBuilder.createAdvancedEnemy(
      spriteSheet,
      ADVANCED_ENEMY_PALETTE
    );

    this.playerBulletSprite = await SpriteBuilder.createBullet(
      spriteSheet,
      PLAYER_BULLET_PALETTE,
      Flip.Vertical
    );

    this.enemyBulletSprite = await SpriteBuilder.createBullet(
      spriteSheet,
      ENEMY_BULLET_PALETTE
    );

    return this;
  }
}
