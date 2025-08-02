import { Player, PLAYER_PALETTE } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";
import spriteUrl from "../../ss.png";
import { Background } from "@/model/background";

export class GameManager {
  player: Player;
  background: Background;

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
}
