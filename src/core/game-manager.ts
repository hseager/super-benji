import { Player } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";

export class GameManager {
  player: Player;
  spriteSheet: SpriteSheet | null = null;
  playerSprite: HTMLImageElement | null = null;

  constructor() {
    this.player = new Player();

    // Load sprite sheet
    const img = new Image();
    img.src = "g.png";
    img.onload = () => {
      this.spriteSheet = new SpriteSheet(img);

      // Build composite player sprite (like JS13k code)
      this.playerSprite = SpriteBuilder.createPlayer(this.spriteSheet);

      // Create player instance
      this.player.sprite = this.playerSprite;
    };
  }
}
