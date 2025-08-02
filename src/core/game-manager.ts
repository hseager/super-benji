import { Player } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";

const DEFAULT_PALETTE = ["#FF0000", "#000000", "#0000FF", "#FFFFFF"];
const POWERUP_PALETTE = ["#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];

export class GameManager {
  player: Player;
  spriteSheet: SpriteSheet | null = null;
  playerSprite: HTMLImageElement | null = null;

  constructor() {
    this.player = new Player();

    const img = new Image();
    img.src = "g.png";
    img.onload = async () => {
      this.spriteSheet = new SpriteSheet(img);

      this.playerSprite = await SpriteBuilder.createPlayer(
        this.spriteSheet,
        DEFAULT_PALETTE
      );
      this.player.sprite = this.playerSprite;
    };
  }
}
