import { Player } from "@/model/player";

export class GameManager {
  player: Player;

  constructor() {
    this.player = new Player();
  }
}
