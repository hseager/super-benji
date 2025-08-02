import { Player } from "@/model/player";
import { SpriteSheet } from "./graphics/sprite-sheet";
import { SpriteBuilder } from "./graphics/sprite-builder";

const PLAYER_PALETTE = [
  "#202020", // deep shadow
  "#404040", // dark panel
  "#606060", // mid-tone metal
  "#808080", // light mid-tone
  "#A0A0A0", // light metal
  "#C0C0C0", // highlight
  "#00BFFF", // cockpit/engine glow
  "transparent", // transparency
];
const POWERUP_PALETTE = ["#FFFF00", "#FF00FF", "#00FFFF", "#FFFFFF"];

export class GameManager {
  player: Player;
  spriteSheet: SpriteSheet | null = null;
  playerSprite: HTMLImageElement | null = null;

  constructor() {
    this.player = new Player();

    const img = new Image();
    img.src = "ss.png";
    img.onload = async () => {
      this.spriteSheet = new SpriteSheet(img);

      this.playerSprite = await SpriteBuilder.createPlayer(
        this.spriteSheet,
        PLAYER_PALETTE
      );
      this.player.sprite = this.playerSprite;
    };
  }
}
