import { PLAYER_PALETTE } from "@/core/model/player";
import { SpriteBuilder } from "../graphics/spriteBuilder";
import { ENEMY_PALETTE } from "@/core/model/enemy";

export class SpriteController {
  playerSprite!: HTMLImageElement;
  enemySprite!: HTMLImageElement;
  bulletSprite!: HTMLImageElement;

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

    this.bulletSprite = await SpriteBuilder.createBullet(
      spriteSheet,
      PLAYER_PALETTE
    );

    return this;
  }
}
