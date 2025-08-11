import { PLAYER_PALETTE } from "@/core/model/player";
import { SpriteBuilder } from "../graphics/spriteBuilder";
import { ENEMY_PALETTE } from "@/core/model/enemy";
import { ENEMY_BULLET_PALETTE, PLAYER_BULLET_PALETTE } from "../config";
import { Flip } from "../graphics/spriteSheet";

export class SpriteController {
  playerSprite!: HTMLImageElement;
  enemySprite!: HTMLImageElement;
  playerBulletSprite!: HTMLImageElement;
  enemyBulletSprite!: HTMLImageElement;

  async init() {
    const spriteSheet = await SpriteBuilder.loadSpriteSheet();

    this.playerSprite = await SpriteBuilder.createPlayer(
      spriteSheet,
      PLAYER_PALETTE
    );

    this.enemySprite = await SpriteBuilder.createBasicEnemy(
      spriteSheet,
      ENEMY_PALETTE
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
