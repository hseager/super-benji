import { PLAYER_PALETTE } from "@/core/model/player";
import { SpriteBuilder } from "../graphics/sprite-builder";
import { ENEMY_PALETTE } from "@/core/model/enemy";

export class SpriteManager {
  playerSprite!: HTMLImageElement;
  enemySprite!: HTMLImageElement;

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

    return this;
  }
}
