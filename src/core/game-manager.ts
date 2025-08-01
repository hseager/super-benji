import { Player } from "@/model/player";
import { drawEngine } from "./draw-engine";

export class GameManager {
  player: Player;

  constructor() {
    this.player = new Player();
  }
}
