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
      description: `Enemies have increased`,
      description2: `projectile speed`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.bulletSpeed *= 1.5;
            return e;
          });
      },
    },
    {
      cost: 8,
      description: `Warp to Rift Horizon`,
      description2: `(Danger!)`,
      apply: async () => {
        this.gameManager.levelManager.currentLevel = 15;
        this.gameManager.levelManager.startLevel();
      },
    },
    {
      cost: 2,
      description: `Enemies deal more damage`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.bulletDamage *= 1.5;
            return e;
          });
      },
    },
    {
      cost: 2,
      description: `Enemies have more health`,
      apply: async () => {
        this.gameManager.levelManager.enemyTypes =
          this.gameManager.levelManager.enemyTypes.map((e) => {
            e.health *= 1.5;
            return e;
          });
      },
    },
    {
      cost: 1,
      description: `Increased enemy count`,
      apply: async () => {
        this.gameManager.levelManager.baseEnemyCount *= 1.5;
      },
    },
    {
      cost: 6,
      description: `Benji deals more damage`,
      description2: `Benji has less max health`,
      apply: async () => {
        this.gameManager.player.maxLife /= 1.5;
        this.gameManager.player.damage *= 1.5;
      },
    },
    {
      cost: 0,
      description: `Last Chance`,
      description2: `Megashot`,
      apply: async () => {
        this.gameManager.player.shootPattern = "megaspread";
      },
    },
    // Legendaries are more common
  ];
}
