import { Player, PLAYER_PALETTE } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";
import spriteUrl from "../../ss.png";
import { Background } from "@/model/background";
import { Bullet } from "@/model/bullet";

export class GameManager {
  player: Player;
  background: Background;
  bullets: Bullet[] = [];

  constructor() {
    // Player
    this.player = new Player();

    const img = new Image();
    img.src = spriteUrl;
    const spriteSheet = new SpriteSheet(img);

    img.onload = async () => {
      const playerSprite = await SpriteBuilder.createPlayer(
        spriteSheet,
        PLAYER_PALETTE
      );
      this.player.sprite = playerSprite;
    };

    // Background
    this.background = new Background();
  }

  fireBullet(x: number, y: number) {
    this.bullets.push(new Bullet(x, y));
  }
}
