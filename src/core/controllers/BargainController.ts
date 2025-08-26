import { Bargain } from "../types";
import { GameController } from "./GameController";

export class BargainController {
  private gameManager: GameController;

  constructor(gameManager: GameController) {
    this.gameManager = gameManager;
  }

  getAllBargains() {
    return this.bargains;
  }

  private bargains: Bargain[] = [
    {
      cost: 3,
      description: `Enemies attack 20% faster`,
      apply: async () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.attackSpeed *= 0.9;
        this.gameManager.player.bulletColor = "green";
      },
    },
    {
      cost: 6,
      description: `Jackal attacks 30% slower`,
      apply: async () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.attackSpeed *= 0.9;
        this.gameManager.player.bulletColor = "green";
      },
    },
    {
      cost: 4,
      description: `Enemies do 10% increased`,
      description2: "damage",
      apply: async () => {
        this.gameManager.player.damage += 4;
        this.gameManager.player.attackSpeed *= 0.9;
        this.gameManager.player.bulletColor = "green";
      },
    },
    // Warp directly to Rift Horizon (Jackal fight)
  ];
}
